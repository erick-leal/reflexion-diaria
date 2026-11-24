const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// A diferencia de un monorepo npm/yarn, pnpm hoistea paquetes dentro de
// node_modules/.pnpm/node_modules/, no directamente en la raiz. Metro necesita
// poder recorrer los node_modules hacia arriba (hierarchical lookup) para
// encontrarlos ahi, asi que NO lo deshabilitamos.
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// El monorepo tiene otra app (admin) con su propia version de React (para
// web). Con hierarchical lookup activo, Metro a veces resolvia "react" hacia
// esa copia hoisteada en vez de la de mobile, causando "Invalid hook call"
// (dos copias de React coexistiendo). extraNodeModules NO alcanza para
// arreglar esto: Metro solo lo consulta si la resolucion normal falla, y
// aca "exito" con la copia equivocada. Hay que interceptar la resolucion
// para estos paquetes de forma incondicional.
const forcedRoots = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
};

// expo-router 57 importa siempre su codigo de native tabs (desde
// withLayoutContext, que usan Tabs y Stack), y en Android eso arrastra
// expo-symbols y su fuente MaterialSymbols de ~976 KB. No usamos native
// tabs ni SymbolView, asi que la fuente se reemplaza por un modulo vacio.
// Si algun dia se usan en Android, sus iconos no se verian: quitar esto.
// Si una version nueva cambia la ruta, esto deja de aplicar sin romper nada.
const emptyModules = new Set([
  "@expo-google-fonts/material-symbols/400Regular",
]);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (emptyModules.has(moduleName)) {
    return { type: "empty" };
  }
  for (const [pkg, root] of Object.entries(forcedRoots)) {
    if (moduleName === pkg || moduleName.startsWith(`${pkg}/`)) {
      const subpath = moduleName.slice(pkg.length); // "" o "/algo"
      const absolutePath = subpath ? path.join(root, subpath) : root;
      return context.resolveRequest(context, absolutePath, platform);
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

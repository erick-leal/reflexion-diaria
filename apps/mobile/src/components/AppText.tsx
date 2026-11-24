import { Text, type TextProps } from "react-native";

import { useTheme, type Theme } from "../theme";

type Variant = keyof Theme["type"];
type ColorKey = "textPrimary" | "textSecondary" | "textMuted";

const defaultColor: Record<Variant, ColorKey> = {
  quote: "textPrimary",
  title: "textPrimary",
  body: "textSecondary",
  label: "textMuted",
  caption: "textMuted",
  button: "textPrimary",
};

interface AppTextProps extends TextProps {
  variant?: Variant;
}

/** Todo texto de la app pasa por aqui: tipografia y color salen del tema, nunca hardcodeados. */
export function AppText({ variant = "body", style, ...rest }: AppTextProps) {
  const theme = useTheme();
  return (
    <Text
      style={[
        theme.type[variant],
        { color: theme.colors[defaultColor[variant]] },
        variant === "label" && { textTransform: "uppercase" },
        style,
      ]}
      {...rest}
    />
  );
}

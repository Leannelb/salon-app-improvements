export interface CustomButtonProps {
    buttonText: string;
    mode: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    onPress: () => void;
    style?: React.CSSProperties;
    labelStyle?: object;
    contentStyle?: object;
    link?: string;
    icon?: string;
}
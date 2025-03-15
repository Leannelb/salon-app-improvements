import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import { CustomButtonProps } from '../types/buttonType';

function CustomButton({ mode, style, onPress, buttonText, link, icon }: CustomButtonProps) {
  return (
    <Button mode={mode} onPress={onPress} style={style} icon={icon}>
      {link && <Link href={link}>{buttonText}</Link>}
      {!link && buttonText}
    </Button>
  );
}

export default CustomButton;

import { Link, Href } from 'expo-router';
import PropTypes from 'prop-types';
import { Button } from 'react-native-paper';

function CustomButton({
  mode,
  style,
  labelStyle,
  contentStyle,
  onPress,
  buttonText,
  link,
  icon,
}: {
  mode: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  style?: object;
  labelStyle?: object;
  contentStyle?: object;
  onPress: () => void;
  buttonText: string;
  link?: Href;
  icon?: string;
}) {
  return (
    <Button mode={mode} onPress={onPress} style={style} icon={icon}>
      {link && <Link href={link}>{buttonText}</Link>}
      {!link && buttonText}
    </Button>
  );
}

export default CustomButton;

CustomButton.propTypes = {
  buttonText: PropTypes.string,
  mode: PropTypes.oneOf(['text', 'outlined', 'contained', 'elevated', 'contained-tonal']),
  onPress: PropTypes.func,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // For runtime PropTypes validation, we should validate that it's either a string (for the path) or an object (for more complex routing configurations that expo-router supports)
  icon: PropTypes.string,
};

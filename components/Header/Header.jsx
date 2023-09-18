import { Image, Text } from "react-native";
import { s } from "./Header.style.jsx";
import headerLogo from "../../assets/logo.png"

export default function Header() {
  return (
    <>
      <Image style={s.img} source={headerLogo} resizeMode="contain" />
      <Text style={s.subtitle}>You can get this done!</Text>
    </>
  );
}

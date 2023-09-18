import { Text, TouchableOpacity } from "react-native";
import {s} from "./ButtonAdd.style.jsx";

export  function ButtonAdd({onPress}) {
  return (
    <>
        <TouchableOpacity onPress={onPress} style={s.btn}>
            <Text style={s.txt}>+ new task</Text>
        </TouchableOpacity>
    </>
  )
}

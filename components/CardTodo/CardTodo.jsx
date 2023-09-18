import { Image, Text, TouchableOpacity } from "react-native";
import { s } from "./CardTodo.style.jsx";
import icon from "../../assets/icon.png";

export default function CardTodo({todo, onPress, onLongPress}) {
  return (
   <>
    <TouchableOpacity onLongPress={() => onLongPress(todo)} onPress={() => onPress(todo)} style={s.card}>
        <Text style={[s.text, todo.isCompleted && {textDecorationLine: "line-through"}]}>{todo.title}</Text>
       {todo.isCompleted && <Image style={s.img} source={icon}/>}
    </TouchableOpacity>
   </>
  )
}

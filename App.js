import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView, Text, View } from "react-native";
import { s } from "./App.style.js";
import Header from "./components/Header/Header.jsx";
import CardTodo from "./components/CardTodo/CardTodo.jsx";
import { useEffect, useState } from "react";
import Footer from "./components/Footer/Footer.jsx";
import { ButtonAdd } from "./components/ButtonAdd/ButtonAdd.jsx";
import Dialog from "react-native-dialog";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
let isFirstRender = true;
let isLoadUpdate = false;

export default function App() {
  const [selectedTabName, setSelectedTabName] = useState("all");
  const [todoList, setTodoList] = useState([]);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");


  useEffect(() => {
    loadTodoList();
  }, [])

  useEffect(() =>{
    if(isLoadUpdate){
      isLoadUpdate = false;
    }else{
    if(!isFirstRender){
      saveTodoList();
    }else{
      isFirstRender = false;
    }
  }
  }, [todoList])

  async function saveTodoList() {
    try {
      await AsyncStorage.setItem("@todolist", JSON.stringify(todoList));
    } catch (error) {
      alert("erreur" + error);
    }
  }

  async function loadTodoList(){
    try {
      const stringifiedTodoList = await AsyncStorage.getItem("@todolist");
      if( stringifiedTodoList !== null){
        const parsedTodoList = JSON.parse(stringifiedTodoList);
        isLoadUpdate = true;
        setTodoList(parsedTodoList);
      }
    } catch (error) {
      alert("erreur" + error); 
    }
  }

  function getFilteredList() {
    switch (selectedTabName) {
      case "all":
        return todoList;
      case "inProgress":
        return todoList.filter((todo) => !todo.isCompleted);
      case "done":
        return todoList.filter((todo) => todo.isCompleted);
    }
  }

  function updateTodo(todo) {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
    const indexToUpdate = todoList.findIndex(
      (todo) => todo.id === updatedTodo.id
    );

    const updatedTodoList = [...todoList];
    updatedTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updatedTodoList);
  }

  function deleteTodo(todoToDelete) {
    Alert.alert("Suppression", "Supprimer cette tâche?", [
      {
        text: "Delete",
        style: "desctructive",
        onPress: () => {
          setTodoList(todoList.filter((todo) => todo.id !== todoToDelete.id));
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }

  function renderTodoList() {
    return getFilteredList().map((todo) => (
      <View style={s.cardItem} key={todo.id}>
        <CardTodo onLongPress={deleteTodo} onPress={updateTodo} todo={todo} />
      </View>
    ));
  }

  function showAddDialog() {
    setIsAddDialogVisible(true);
  }

  function addTodo() {
    const newTodo = {
      id: uuid.v4(),
      title: inputValue,
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
    setIsAddDialogVisible(false);
  }
  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={s.app}>
          <View style={s.header}>
            <Header />
          </View>
          <View style={s.body}>
            <ScrollView>{renderTodoList()}</ScrollView>
          </View>
          <ButtonAdd onPress={showAddDialog} />
        </SafeAreaView>
      </SafeAreaProvider>
      <Footer
        todoList={todoList}
        onPress={setSelectedTabName}
        selectedTabName={selectedTabName}
      />

      <Dialog.Container
        visible={isAddDialogVisible}
        onBackdropPress={() => setIsAddDialogVisible(false)}
      >
        <Dialog.Title>Créer une tâche</Dialog.Title>
        <Dialog.Description>Nom de la nouvelle tâche</Dialog.Description>
        <Dialog.Input onChangeText={setInputValue} />

        <Dialog.Button
          disabled={inputValue.trim().length === 0}
          label="Créer"
          onPress={addTodo}
        />
      </Dialog.Container>
    </>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import { Bars2Icon, PlusIcon, XMarkIcon } from "react-native-heroicons/solid";

export default function App() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  const handleTodoInput = (text) => {
    setText(text);
  };

  const handleAddTodo = () => {
    if (!text.length || list.find((item) => item.text === text)) {
      console.log("same");
      return;
    }

    setList((prev) => [
      ...prev,
      {
        key: text,
        text,
        complete: false,
      },
    ]);
    setText("");
    Keyboard.dismiss();
  };

  const handleDeleteTodo = (text) => {
    setList((prev) => prev.filter((item) => item.text !== text));
  };

  const handleToggleTodo = (text) => {
    setList((prev) =>
      prev.map((item) => {
        if (item.text === text) {
          return { ...item, complete: !item.complete };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const savedList = await AsyncStorage.getItem("list");
        if (savedList != null) {
          setList(JSON.parse(savedList));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const listJSON = JSON.stringify(list);
        await AsyncStorage.setItem("list", listJSON);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [list]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add new..."
          value={text}
          style={styles.input}
          onChangeText={handleTodoInput}
        />
        <Pressable onPress={handleAddTodo} style={styles.inputButton}>
          <PlusIcon style={styles.inputButtonText} />
        </Pressable>
      </View>
      <View style={styles.listContainer}>
        <GestureHandlerRootView>
          <DraggableFlatList
            data={list}
            onDragEnd={({ data }) => setList(data)}
            keyExtractor={(item) => item.key}
            renderItem={({ item, drag, isActive }) => (
              <ScaleDecorator>
                <View
                  style={[
                    styles.listItem,
                    item.complete ? styles.listItemComplete : null,
                  ]}
                >
                  <Pressable onPressIn={drag} disabled={isActive}>
                    <Text style={styles.listItemHandle}>
                      <Bars2Icon style={styles.listItemHandleIcon} />
                    </Text>
                  </Pressable>
                  <Text
                    style={styles.listItemText}
                    onPress={() => handleToggleTodo(item.text)}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={styles.listItemDelete}
                    onPress={() => handleDeleteTodo(item.text)}
                  >
                    <XMarkIcon style={styles.listItemDeleteIcon} />
                  </Text>
                </View>
              </ScaleDecorator>
            )}
          />
        </GestureHandlerRootView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D4D6B9",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#D1CAA1",
    padding: 16,
    fontSize: 20,
    borderRadius: 3,
  },
  inputButton: {
    backgroundColor: "#32213A",
    padding: 16,
    fontSize: 16,
    borderRadius: 3,
    overflow: "hidden",
  },
  inputButtonText: {
    color: "#fff",
  },
  listContainer: {
    flex: 1,
    marginTop: 50,
    // backgroundColor: "red",
  },
  listItem: {
    // backgroundColor: "#66717E",
    backgroundColor: "#383B53",
    borderRadius: 3,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  listItemHandle: {
    borderRadius: 3,
    backgroundColor: "#32213A",
    padding: 16,
  },
  listItemHandleIcon: {
    color: "#fff",
  },
  listItemText: {
    color: "#fff",
    flex: 1,
    fontSize: 20,
    padding: 8,
  },
  listItemDelete: {
    color: "#fff",
    fontSize: 26,
    backgroundColor: "#32213A",
    padding: 16,
    borderRadius: 3,
  },
  listItemDeleteIcon: {
    color: "#fff",
  },
  listItemComplete: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
});

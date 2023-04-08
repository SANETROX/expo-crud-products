import * as React from "react";
import * as RN from "react-native";
import { useNavigation } from "@react-navigation/native";
import { database } from "./../config/fb";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Product from "./../components/Product";
export default function Home() {
  const navigation = useNavigation();
  const [products, setproducts] = React.useState([]);
  React.useLayoutEffect(() =>
    navigation.setOptions({
      headerRight: () => (
        <RN.Button
          title="Go to Add"
          onPress={() => navigation.navigate("Add")}
        />
      ),
    })
  );
  React.useEffect(() => {
    const collectionRef = collection(database, "products");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setproducts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          emoji: doc.data().emoji,
          name: doc.data().name,
          price: doc.data().price,
          isSold: doc.data().isSold,
          createdAt: doc.data().createdAt,
        }))
      );
    });
    return unsuscribe;
  }, []);
  return (
    <RN.ScrollView style={styles.container}>
      <RN.Text style={styles.title}>Products</RN.Text>
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </RN.ScrollView>
  );
}

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3F9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    margin: 16,
  },
});

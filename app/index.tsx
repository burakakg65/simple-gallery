import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState } from "react";
import { Button, FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

const images = [
  {
    id: "1",
    thumbnail: "https://picsum.photos/200/200?random=1",
    full: "https://picsum.photos/500/500?random=1",
    description: "Doğa Manzarası 1",
  },
  {
    id: "2",
    thumbnail: "https://picsum.photos/200/200?random=2",
    full: "https://picsum.photos/500/500?random=2",
    description: "Doğa Manzarası 2",
  },
  {
    id: "3",
    thumbnail: "https://picsum.photos/200/200?random=3",
    full: "https://picsum.photos/500/500?random=3",
    description: "Doğa Manzarası 3",
  },
  {
    id: "4",
    thumbnail: "https://picsum.photos/200/200?random=4",
    full: "https://picsum.photos/500/500?random=4",
    description: "Doğa Manzarası 4",
  },
];

// types for selected image or qr result
type SelectedImage = {
  full: string;
  description: string;
};

export default function Index() {
  const [selected, setSelected] = useState<SelectedImage | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScannerVisible(false);
    // QR koddan gelen URL ise aç
    if (data.startsWith('http')) {
      setSelected({
        full: data,
        description: 'QR ile açıldı',
      });
    } else {
      alert(`QR kod: ${data}`);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* --- ÜSTTE BÜYÜK GÖRÜNTÜ ALANI --- */}
      <View style={styles.viewer}>
        {selected ? (
          <>
            <Image source={{ uri: selected.full }} style={styles.fullImage} />
            <Text style={styles.description}>{selected.description}</Text>
          </>
        ) : (
          <Text style={styles.placeholder}>Görüntülemek için bir resme dokunun</Text>
        )}
      </View>
      <Button title="QR Oku" onPress={() => setScannerVisible(true)} />
      <Modal visible={scannerVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {hasPermission === null ? (
            <Text>İzin isteniyor...</Text>
          ) : hasPermission === false ? (
            <Text>Kamera izni yok</Text>
          ) : (
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={{ flex: 1 }}
            />
          )}
          <Button title="Kapat" onPress={() => setScannerVisible(false)} />
        </View>
      </Modal>

      {/* --- ALTTA THUMBNAIL GRID --- */}
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          </Pressable>
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f4f4f4",
  },

  viewer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#ddd",
  },

  placeholder: {
    fontSize: 16,
    color: "#555",
  },

  fullImage: {
    width: 250,
    height: 250,
    marginBottom: 10,
    borderRadius: 10,
  },

  description: {
    fontSize: 16,
    fontWeight: "bold",
  },

  grid: {
    paddingHorizontal: 10,
  },

  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

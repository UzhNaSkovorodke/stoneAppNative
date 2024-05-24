import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { DocumentPicker } from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";

const FakeScreen = () => {
  const [data, setData] = useState(null);

 
  useEffect(() => {
    console.log(data);
  }, [data]);

  const readFileAsBase64 = async (uri) => {
    RNFetchBlob.fs
      .readFile(uri, "base64")
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
      });
  };

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: false,

      });
      await readFileAsBase64(doc[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User cancelled the upload", err);
      else
        console.log(err);
    }
  };

  return (
    <View>
      <Text
        style={{
          color: "black",
          fontSize: 28,
          textAlign: "center",
          marginVertical: 40,
        }}>
        Document Picker
      </Text>
      <View style={{ marginHorizontal: 40 }}>
        <Button title="Select Document" onPress={selectDoc} />
      </View>
    </View>
  );
};
export default FakeScreen;

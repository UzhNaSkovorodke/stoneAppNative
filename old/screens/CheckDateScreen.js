import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import DefaultButton from "../components/buttons/DefaultButton";
import CalendarPicker from "react-native-calendar-picker";


const CheckDateScreen = ({ route, navigation }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const startDate = selectedDay ? selectedDay.toString() : "";

  return (
    <ScrollView style={{ backgroundColor: "#F7F7F9" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          backgroundColor: "#F7F7F9",
        }}>
        <View style={styles.container}>
          <CalendarPicker
            weekdays={["Вс.", "Пн.", "Вт.", "Ср.", "Чт.", "Пт.", "Сб."]}
            months={[
              "Январь,",
              "Февраль,",
              "Март,",
              "Апрель,",
              "Май,",
              "Июнь,",
              "Июль,",
              "Август,",
              "Сентябрь,",
              "Октябрь,",
              "Ноябрь,",
              "Декабрь,",
            ]}
            previousTitle="Предыдущий"
            nextTitle="Следующий"
            todayBackgroundColor="#E5E5E5FF"
            selectedDayColor="#747E90"
            selectedDayTextColor="#FFFFFF"
            onDateChange={setSelectedDay}
          />


        </View>

        <DefaultButton
          onPress={() => {
            selectedDay
              ? route.params.onSetDate(selectedDay)
              : null;
            navigation.goBack();
          }}
          text="Применить дату"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0)",
    marginTop: 100,
  },
});

export default CheckDateScreen;

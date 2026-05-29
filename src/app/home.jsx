import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import * as Location from "expo-location";
import { router } from "expo-router";

import {
  OFFICE_LOCATION,
  MAX_DISTANCE,
  calculateDistance,
} from "../utils/location";

export default function Home() {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission required"
      );
      return;
    }

    startTracking();
  };

  const startTracking = async () => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (location) => {
        const currentLat =
          location.coords.latitude;

        const currentLng =
          location.coords.longitude;

        // GPS Accuracy
        const accuracy =
          location.coords.accuracy;

        console.log("Accuracy:", accuracy);

        // Ignore bad GPS signal
        if (accuracy > 50) {
          console.log("Poor GPS Accuracy");
          return;
        }

        const distanceInMeters =
          calculateDistance(
            currentLat,
            currentLng,
            OFFICE_LOCATION.latitude,
            OFFICE_LOCATION.longitude
          );

        console.log(
          "Distance:",
          distanceInMeters
        );

        setDistance(
          distanceInMeters.toFixed(2)
        );

        // Logout only if user is really far
        if (distanceInMeters > MAX_DISTANCE) {
          Alert.alert(
            "Logged Out",
            "You moved outside office range"
          );

          router.replace("/login");
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome Shivam 🚀
      </Text>

      <Text style={styles.distance}>
        Distance: {distance} meters
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },

  distance: {
    fontSize: 18,
    color: "#CBD5E1",
  },
});
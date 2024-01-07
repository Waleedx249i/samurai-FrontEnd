import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export let useTripStore = defineStore("trip", () => {
  let id = ref(null);
  let user_id = ref(null);

  let origin = reactive({
    lat: null,
    lng: null,
  });
  let destination = reactive({
    lat: null,
    lng: null,
  });
  let driver_location = reactive({
    lat: null,
    lng: null,
  });
  let destination_name = ref("");

  let driver = reactive({
    id: null,
    year: null,
    make: null,
    model: null,
    license_plate: null,
    user: {
      name: null,
    },
  });

  let is_started = ref(false);
  let is_complete = ref(false);

  let reset = () => {
    id.value = null;
    user_id.value = null;

    origin.lat = null;
    origin.lng = null;

    destination.lat = null;
    destination.lng = null;

    driver_location.lat = null;
    driver_location.lng = null;

    destination_name.value = "";

    driver.id = null;
    driver.year = null;
    driver.make = null;
    driver.model = null;
    driver.license_plate = null;
    driver.user.name = null;

    is_started.value = false;
    is_complete.value = false;
  };

  return {
    id,
    user_id,
    origin,
    destination,
    driver_location,
    destination_name,
    is_started,
    is_complete,
    reset,
  };
});

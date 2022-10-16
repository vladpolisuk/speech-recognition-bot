import axios from 'axios';
export const TELEGRAM_API_KEY = "5428829984:AAFse4sGWam_AIrWiwNi3d-e4MDWIr21qwE";
export const YANDEX_API_KEY = "AQVNznGPhwP2CJBnNYbneCjtQe-_aXVKqKq8Mweb";

export const axiosConfig = {
    method: "POST",
    url: "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize",
    headers: {
        Authorization: "Api-Key " + YANDEX_API_KEY
    },
}
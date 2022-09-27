import React, { useState, useEffect } from "react";

import styled from "@emotion/styled";
import { ReactComponent as CloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as HumidityIcon } from "./images/humidity.svg";

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${(props) => (props.theme === "dark" ? "#212121" : "#DADADA")};
  margin-bottom: 12px;
`;

const Description = styled.div`
  font-size: 24px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const Cloudy = styled(CloudyIcon)`
  flex-basis: 30%;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Humidity = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Time = styled.div`
  margin-top: 24px;
`;

const Refresh = styled(RefreshIcon)`
  width: 15px;
  height: 15px;
  position: absolute;
  right: 15px;
  bottom: 15px;
  cursor: pointer;
`;

const WeatherApp = () => {
  console.log("invoke component");
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    description: "",
    temperature: 0,
    windSpeed: 0,
    humidity: 0,
    weatherCondition: "",
    comfortIndex: "",
    possibilityOfPrecipitation: 0
  });

  useEffect(() => {
    console.log("execute function in useEffect");
    fetchWeatherData();
    fetchForecastWeatherData();
  }, []);

  const fetchWeatherData = () => {
    const uri =
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-3D7EEA69-8129-4281-8769-1DCA20D42648&locationName=%E8%87%BA%E5%8C%97";
    fetch(uri, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const weatherElementData = data.records.location[0];
        const weatherElement = weatherElementData.weatherElement.reduce(
          (accumulator, currentValue) => {
            if (["WDSD", "TEMP", "HUMD"].includes(currentValue.elementName)) {
              accumulator[currentValue.elementName] = currentValue.elementValue;
            }

            return accumulator;
          },
          {}
        );

        setWeatherElement((prevState) => ({
          ...prevState,
          observationTime: weatherElementData.time.obsTime,
          temperature: weatherElement.TEMP,
          windSpeed: weatherElement.WDSD,
          humidity: weatherElement.HUMD
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchForecastWeatherData = () => {
    const uri =
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-3D7EEA69-8129-4281-8769-1DCA20D42648&locationName=%E8%87%BA%E5%8C%97%E5%B8%82";
    fetch(uri, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const forecastWeatherElementData = data.records.location[0];
        const forecastWeatherElement = forecastWeatherElementData.weatherElement.reduce(
          (accumulator, currentValue) => {
            if (["Wx", "PoP", "CI"].includes(currentValue.elementName)) {
              accumulator[currentValue.elementName] =
                currentValue.time[0].parameter.parameterName;
            }
            console.log(accumulator);
            return accumulator;
          },
          {}
        );

        setWeatherElement((prevState) => ({
          ...prevState,
          locationName: forecastWeatherElementData.locationName,
          weatherCondition: forecastWeatherElement.Wx,
          comfortIndex: forecastWeatherElement.CI,
          possibilityOfPrecipitation: forecastWeatherElement.PoP
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      {console.log("render")}
      <WeatherCard>
        <Location theme="dark">{weatherElement.locationName}</Location>
        <Description>
          {weatherElement.weatherCondition} {weatherElement.comfortIndex}
        </Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(weatherElement.temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <Cloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          {weatherElement.windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon />
          {weatherElement.possibilityOfPrecipitation}%
        </Rain>
        <Humidity>
          <HumidityIcon />
          {weatherElement.humidity * 100}%
        </Humidity>
        <Time>
          {`Last update: ` +
            new Intl.DateTimeFormat("zh-TW", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric"
            }).format(new Date(weatherElement.observationTime))}
        </Time>
        <Refresh
          onClick={() => {
            fetchWeatherData();
            fetchForecastWeatherData();
          }}
        />
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;

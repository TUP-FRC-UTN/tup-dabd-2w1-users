export interface WeatherData {
    dayOfWeek: string;
    main: {
      temp: number;
      humidity: number;
    };
    weather: [{
      description: string;
      icon: string;
    }];
    dt_txt?: string;
  }
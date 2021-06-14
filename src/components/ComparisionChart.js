import React, { useState, useEffect } from "react";
import { getHistoricalPrice } from "../apiService/stockApi";
import HighchartsReact from "highcharts-react-official";
import HighStock from "highcharts/highstock";

import StockForm from "./StockForm";

let mockOptions = {
  rangeSelector: {
    selected: 4,
  },
  credits: {
    enabled: false,
  },
  title: {
    text: "Performance Comparision",
  },
  yAxis: {
    labels: {
      formatter: function () {
        return (this.value > 0 ? " + " : "") + this.value;
      },
    },
  },
  tooltip: {
    split: true,
    pointFormat:
      '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ',
  },
  series: [],
};

const companies = ["AAPL", "GOOGL", "AMZN"];

const ComparisionChart = () => {
  const [chartData, setChartData] = useState({ options: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [series, setSeries] = useState([]);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    getChartData();
  }, []);

  // used to fetch chart data
  const getChartData = () => {
    let returnedPromises = companies.map((company) => {
      return getHistoricalPrice(company);
    });

    Promise.all(returnedPromises)
      .then((values) => {
        setIsLoading(true);
        values.forEach((value) => {
          if (value.symbol) {
            createChartData(value.historical, value.symbol);
          }
        });
        cretaeChartOptions();
      })
      .catch((err) => console.log(err));
  };

  const cretaeChartOptions = () => {
    let options = mockOptions;
    options.series = series;
    setChartData({ options });
    setIsLoading(false);
  };

  const createChartData = (chartData, seriesName) => {
    let i = companies.indexOf(seriesName);
    let seriesData = [];
    let stateSeries = series;

    setFormData((oldFormData) => {
      return [
        {
          ...chartData[0],
          name: seriesName,
        },
        ...oldFormData,
      ];
    });

    // data is coming from recent to old in API whereas highcharts requries in increasing order of date
    chartData.reverse();

    chartData.forEach((item) => {
      let date = new Date(item.date);
      seriesData.push([date.getTime(), item.close]);
    });

    stateSeries[i] = {
      name: seriesName,
      data: [...seriesData],
    };
    setSeries(stateSeries);
  };

  return (
    <div className="body-container">
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <div className="body-container-card">
          <HighchartsReact
            highcharts={HighStock}
            constructorType={"stockChart"}
            options={chartData.options}
          />
        </div>
      )}
      <StockForm formData={formData} />
    </div>
  );
};

export default ComparisionChart;

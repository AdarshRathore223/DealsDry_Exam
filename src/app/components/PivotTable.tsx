"use client";
import React, { useEffect, useRef, useState } from "react";
import * as WebDataRocks from "@webdatarocks/react-webdatarocks";
import "@webdatarocks/webdatarocks/webdatarocks.min.css";
import { useFetchData } from "../hooks/useFetchData";

const PivotTable: React.FC = () => {
  const ref = useRef<WebDataRocks.Pivot | null>(null);
  const { data: tableData, error, isLoading } = useFetchData("/api/user"); 
  const [isPivotReady, setIsPivotReady] = useState(false); 
  const [data, setData] = useState<any[]>([]); 

  useEffect(() => {
    if (Array.isArray(tableData)) {
      const filteredData = tableData.map(({ uid, ...rest }) => rest);
      setData(filteredData); 
    }
  }, [tableData]);
  const report = React.useMemo(() => {
    return {
      dataSource: {
        data: data, 
      },
      slice: {
        rows: [
          { field: "amount" }, 
        ],
        columns: [
          { field: "category" },
        ],
        measures: [
          { field: "amount", aggregator: "sum", caption: "Total Amount" }, 
        ],
      },
    };
  }, [data]);

  useEffect(() => {
    const pivot = ref.current?.webdatarocks;

    if (pivot) {
      setIsPivotReady(true); 
      if (data.length > 0) {
        try {
          pivot.setReport(report);
        } catch (e) {
          console.warn("Report could not be set due to an internal error:", e);
        }
      }

      const onReportComplete = () => {
        pivot.off("reportcomplete", onReportComplete); 
      };

      pivot.on("reportcomplete", onReportComplete);

      return () => {
        pivot.off("reportcomplete", onReportComplete);
      };
    }
  }, [data, report]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <div>
      <WebDataRocks.Pivot
        ref={ref}
        toolbar={false}
        width="100%"
        report={isPivotReady && data.length > 0 ? report : undefined} 
      />
    </div>
  );
};

export default PivotTable;
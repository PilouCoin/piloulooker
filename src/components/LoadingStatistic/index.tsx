import React from "react";
import { Skeleton, Statistic, Tooltip } from "antd";
import QuestionCircle from "components/QuestionCircle";

interface LoadingStatisticProps {
  isLoading: boolean;
  title: string;
  tooltip?: string;
  value: any;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  valueStyle?: any;
}

const LoadingStatistic = ({
  isLoading,
  title,
  tooltip,
  ...rest
}: LoadingStatisticProps) => (
  <>
    {isLoading ? <div className="ant-statistic-title">{title}</div> : null}
    <Skeleton
      loading={isLoading}
      active
      paragraph={false}
      className="isloading-skeleton-width"
    >
      <Statistic
        title={
          <>
            {title}
            {tooltip ? (
              <span style={{ marginLeft: "6px" }}>
                <Tooltip placement="right" title={tooltip}>
                  <QuestionCircle />
                </Tooltip>
              </span>
            ) : null}
          </>
        }
        {...rest}
      />
    </Skeleton>
  </>
);

export default LoadingStatistic;

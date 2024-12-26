import { useSelector } from "react-redux";
import { NavBar, DatePicker } from "antd-mobile";
import "./index.scss";
import _ from "lodash";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import classNames from "classnames";
import DailyBill from "./components/Daybill";

const Month = () => {
  // 按月分组
  const billList = useSelector((state) => state.bill.billList);
  const monthGroup = useMemo(() => {
    return _.groupBy(billList, (item) => dayjs(item.date).format("YYYY-MM"));
  }, [billList]);

  // 控制时间选择器打开关闭
  const [dateVisible, setDateVisible] = useState(false);
  const [currentMonthList, setMonthList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    return dayjs().format("YYYY-MM");
  });

  const dateConfirm = (date) => {
    setDateVisible(false);
    const monthKey = dayjs(date).format("YYYY-MM");
    setCurrentMonth(monthKey);
    setMonthList(monthGroup[monthKey]);
  };

  // 首次加载
  useEffect(() => {
    const list = monthGroup[dayjs().format("YYYY-MM")];
    if (list) {
      setMonthList(list);
    }
  }, [monthGroup]);

  // 计算统计
  const overview = useMemo(() => {
    // 如果 currentMonthList 为空或未定义，函数会立即返回一个包含默认值的对象，其中 income、pay 和 total 都为 0
    if (!currentMonthList) return { income: 0, pay: 0, total: 0 };
    // 使用 reduce 方法对 currentMonthList 数组中的每个元素进行迭代，计算 income、pay 和 total 的值
    const income = currentMonthList
      .filter((item) => item.type === "income")
      .reduce((a, c) => a + c.money, 0);
    const pay = currentMonthList
      .filter((item) => item.type === "pay")
      .reduce((a, c) => a + c.money, 0);
    return {
      income,
      pay,
      total: income + pay,
    };
    //当依赖项 currentMonthList 发生变化时，重新计算
  }, [currentMonthList]);

  // 计算单日列表
  // 把当前月按日分组账单数据
  const dayGroup = useMemo(() => {
    const group = _.groupBy(currentMonthList, (item) =>
      dayjs(item.date).format("YYYY-MM-DD")
    );
    return {
      dayKeys: Object.keys(group),
      group,
    };
  }, [currentMonthList]);
  console.log(dayGroup);

  return (
    <div className="monthlyBill">
      <NavBar className="nav">月度收支</NavBar>
      <div className="content">
        <div className="header">
          {/* 时间切换区域 */}
          <div className="date" onClick={() => setDateVisible(true)}>
            <span className="text">{currentMonth} 账单</span>
            <span
              className={classNames("arrow", dateVisible && "expand")}
            ></span>
          </div>
          {/* 统计区域 */}
          <div className="twoLineOverview">
            <div className="item">
              <span className="money">{overview.pay.toFixed(2)}</span>
              <span className="type">支出</span>
            </div>
            <div className="item">
              <span className="money">{overview.income.toFixed(2)}</span>
              <span className="type">收入</span>
            </div>
            <div className="item">
              <span className="money">{overview.total.toFixed(2)}</span>
              <span className="type">结余</span>
            </div>
          </div>
          {/* 时间选择器 */}
          <DatePicker
            className="kaDate"
            title="记账日期"
            precision="month"
            visible={dateVisible}
            max={new Date()}
            onConfirm={dateConfirm}
          />
        </div>
        {/* 单日列表统计 */}
        {/* 日账单 */}
        {dayGroup.dayKeys.map((dayKey) => (
          <DailyBill
            key={dayKey}
            date={dayKey}
            billList={dayGroup.group[dayKey]}
          />
        ))}
      </div>
    </div>
  );
};

export default Month;

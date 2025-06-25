
const Header = ({ date, onPrev, onNext }) => {
  const currentYear = date.year();
  const currentMonth = date.format("MMMM");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const yearOptions = Array.from({ length: 2030 - 1980 + 1 }, (_, i) => 1980 + i);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    const newDate = new Date(`${newMonth} 1, ${currentYear}`);
    window.dispatchEvent(new CustomEvent("updateMonthYear", { detail: newDate }));
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    const newDate = new Date(`${currentMonth} 1, ${newYear}`);
    window.dispatchEvent(new CustomEvent("updateMonthYear", { detail: newDate }));
  };

  return (
    <div className="calendar-header">
      <div className="header-buttons">
        <button onClick={onPrev}>&lt; Prev</button>
        <h1>
          <select value={currentMonth} onChange={handleMonthChange} className="month-dropdown">
            {monthNames.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select value={currentYear} onChange={handleYearChange} className="year-dropdown">
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </h1>
        <button onClick={onNext}>Next &gt;</button>
      </div>
    </div>
  );
};

export default Header;

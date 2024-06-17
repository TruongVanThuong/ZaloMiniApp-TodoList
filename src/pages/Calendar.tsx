import React, { useState, useEffect } from "react";
import {
  Page,
  // Calendar, 
  List,
  Text
} from "zmp-ui";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


interface Job {
  job: string;
  date: string;
}

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') as string) as Job[];
    setJobs(storedJobs);
    console.log(storedJobs);
  }, []);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date.toISOString());
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredJobs = selectedDate
    ? jobs.filter(job => formatDate(job.date) === formatDate(selectedDate))
    : [];

  return (
    <Page className='section-container'>
      <Calendar onChange={handleDayClick} />
      <div style={{ padding: '12px' }}>
        {selectedDate && (
          <>
            <Text>{`Jobs for ${formatDate(selectedDate)}`}</Text>
            <List>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <List.Item
                    key={index}
                    title={job.job}
                    subTitle={formatDate(job.date)}
                  />
                ))
              ) : (
                <Text>No jobs for this date.</Text>
              )}
            </List>
          </>
        )}
      </div>
    </Page>
  );
};

export default CalendarPage;

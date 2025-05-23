import {Component, HostListener, OnInit} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';
import {IdopontfoglalasService} from '../../shared/services/idopontfoglalas.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalBookings: number = 0;
  dailyBookingsCount: number = 0;
  weeklyBookingsCount: number = 0;
  uniqueParents: number = 0;

  dailyBookings: { datum: string; time: string; name: string; service?: string }[] = [];
  weeklyBookings: { datum: string; time: string; name: string; service?: string }[] = [];

  viewMode: string = 'daily';

  totalBookingsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Foglalások száma',
        data: [],
        backgroundColor: '#007bff',
      },
    ],
  };

  weeklyBookingsChartData: ChartData<'bar'> = {
    labels: ['Ezen a héten'],
    datasets: [
      {
        label: 'Heti foglalások',
        data: [],
        backgroundColor: '#28a745',
      },
    ],
  };

  dailyBookingsChartData: ChartData<'bar'> = {
    labels: ['Mai nap'],
    datasets: [
      {
        label: 'Napi foglalások',
        data: [],
        backgroundColor: '#ffc107',
      },
    ],
  };

  uniqueParentsChartData: ChartData<'bar'> = {
    labels: ['Egyedi szülők'],
    datasets: [
      {
        label: 'Egyedi szülők száma',
        data: [],
        backgroundColor: '#dc3545',
      },
    ],
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Db',
        },
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };


  constructor(private foglalasService: IdopontfoglalasService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadStatistics();
    this.loadChartData();
    this.loadDailyBookings();
    this.refreshCharts();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.refreshCharts();
  }

  refreshCharts(): void {
    this.totalBookingsChartData = {...this.totalBookingsChartData};
    this.weeklyBookingsChartData = {...this.weeklyBookingsChartData};
    this.dailyBookingsChartData = {...this.dailyBookingsChartData};
    this.uniqueParentsChartData = {...this.uniqueParentsChartData};
  }

  loadStatistics(): void {
    this.foglalasService.getTotalBookings().subscribe((total) => {
      this.totalBookings = total;
    });

    this.foglalasService.getWeeklyBookings().subscribe((weekly) => {
      this.weeklyBookingsCount = weekly;
      this.weeklyBookingsChartData.datasets[0].data = [weekly];
    });

    this.foglalasService.getDailyBookings().subscribe((daily) => {
      this.dailyBookingsCount = daily;
      this.dailyBookingsChartData.datasets[0].data = [daily];
    });

    this.foglalasService.getUniqueParents().subscribe((unique) => {
      this.uniqueParents = unique;
      this.uniqueParentsChartData.datasets[0].data = [unique];
    });
  }

  loadChartData(): void {
    this.foglalasService.getTotalBookingsByMonth().subscribe((data) => {
      this.totalBookingsChartData.labels = data.map((item) => item.month);
      this.totalBookingsChartData.datasets[0].data = data.map((item) => item.count);
    });
  }

  loadDailyBookings(): void {
    this.foglalasService.getDailyBookingsList().subscribe((bookings) => {

      this.dailyBookings = bookings.map((booking) => {

        return {
          datum: booking.datum,
          time: `${booking.kezdesiIdo} - ${booking.befejezesiIdo}`,
          name: booking.felhasznaloTeljesNev,
          service: booking.szolgaltatasNev ? booking.szolgaltatasNev : 'N/A',
        };
      });

    });
  }

  loadWeeklyBookings(): void {
    this.foglalasService.getWeeklyBookingsList().subscribe((bookings) => {

      this.weeklyBookings = bookings.map((booking) => {

        return {
          datum: booking.datum,
          time: `${booking.kezdesiIdo} - ${booking.befejezesiIdo}`,
          name: booking.felhasznaloTeljesNev,
          service: booking.szolgaltatasNev ? booking.szolgaltatasNev : 'N/A',
        };
      });

    });
  }


  toggleViewMode(): void {
    if (this.viewMode === 'daily') {
      this.viewMode = 'weekly';
      this.loadWeeklyBookings();
    } else {
      this.viewMode = 'daily';
      this.loadDailyBookings();
    }

    setTimeout(() => {
      this.refreshCharts();
    }, 300);
  }
}

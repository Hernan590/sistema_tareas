import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit {
  nombreUsuario: string = '';

  ngOnInit(): void {
    this.nombreUsuario = sessionStorage.getItem('nombre') || 'Usuario';

    new Chart("tareasChart", {
      type: 'doughnut',
      data: {
        labels: ['Completadas', 'Pendientes', 'Vencidas'],
        datasets: [{
          data: [24, 5, 3],
          backgroundColor: ['#198754', '#ffc107', '#dc3545'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}


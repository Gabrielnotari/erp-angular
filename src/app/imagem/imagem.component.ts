import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-imagem',
  standalone: true,  // se for standalone module
  imports: [CommonModule, FormsModule],
  templateUrl: './imagem.component.html',
  styleUrls: ['./imagem.component.css']
})
export class ImagemComponent {

  prompt: string = '';
  imageUrl: string | null = null;
  loading: boolean = false;

  constructor(private apiService: ApiService) {}

  gerarImagem() {
    if (!this.prompt.trim()) return;

    this.loading = true;
    this.imageUrl = null;

    this.apiService.gerarImagem(this.prompt).subscribe({
      next: (url) => {
        this.imageUrl = url;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao gerar imagem:', err);
        this.loading = false;
      }
    });
  }
}

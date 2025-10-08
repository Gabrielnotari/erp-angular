import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

   authStatuschanged = new EventEmitter<void>();
  public static BASE_URL = 'http://localhost:8080/api';
  private static ENCRYPTION_KEY = "gabriel123";
  
  constructor(private http: HttpClient) {}

    // Encrypt dados e salvar no localStorage
    encryptAndSaveToStorage(key: string, value: string): void {
      const encryptedValue = CryptoJS.AES.encrypt(value, ApiService.ENCRYPTION_KEY).toString();
      localStorage.setItem(key, encryptedValue);
    }

    // Recuperar do armazenamento local e descriptografar
    private getFromStorageAndDecrypt(key: string): any {
      try {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;
        return CryptoJS.AES.decrypt(encryptedValue, ApiService.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      } catch (error) {
        return null;
      }
    }

    
  private clearAuth() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
  }



  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt("token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }




  /***AUTH & USERS API METODOS */

  registerUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }

  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/usuarios/atual`, {
      headers: this.getHeader(),
    });
  }



  /**CATEGORIA ENDPOINTS */
  createCategory(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/categorias/add`, body, {
      headers: this.getHeader(),
    });
  }

  getAllCategory(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categorias/todas`, {
      headers: this.getHeader(),
    });
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categorias/${id}`, {
      headers: this.getHeader(),
    });
  }

  updateCategory(id: string, body: any): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/categorias/atualizar/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/categorias/deletar/${id}`, {
      headers: this.getHeader(),
    });
  }



   /** FORNECEDOR API */
  addFornecedor(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/fornecedores/add`, body, {
      headers: this.getHeader(),
    });
  }

  getAllFornecedores(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/fornecedores/todos`, {
      headers: this.getHeader(),
    });
  }

  getFornecedorById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/fornecedores/${id}`, {
      headers: this.getHeader(),
    });
  }

  updateFornecedor(id: string, body: any): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/fornecedores/atualizar/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  deleteFornecedor(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/fornecedores/deletar/${id}`, {
      headers: this.getHeader(),
    });
  }

  /** PROJETO API */
addProjeto(body: any): Observable<any> {
  return this.http.post(`${ApiService.BASE_URL}/projetos/add`, body, {
    headers: this.getHeader(),
  });
}

getAllProjetos(): Observable<any> {
  return this.http.get(`${ApiService.BASE_URL}/projetos/todos`, {
    headers: this.getHeader(),
  });
}

getProjetoById(id: string): Observable<any> {
  return this.http.get(`${ApiService.BASE_URL}/projetos/${id}`, {
    headers: this.getHeader(),
  });
}

updateProjeto(id: string, body: any): Observable<any> {
  return this.http.put(`${ApiService.BASE_URL}/projetos/atualizar/${id}`, body, {
    headers: this.getHeader(),
  });
}

deleteProjeto(id: string): Observable<any> {
  return this.http.delete(`${ApiService.BASE_URL}/projetos/deletar/${id}`, {
    headers: this.getHeader(),
  });
}


/** CLIENTE API */
getAllClientes() {
  return this.http.get(`${ApiService.BASE_URL}/clientes/todos`, {
    headers: this.getHeader(),
  });
}

deleteCliente(id: number) {
  return this.http.delete(`${ApiService.BASE_URL}/clientes/deletar/${id}`, {
    headers: this.getHeader(),
  });
}

getClienteById(id: number) {
  return this.http.get(`${ApiService.BASE_URL}/clientes/${id}`, {
    headers: this.getHeader(),
  });
}

getProjetosByCliente(id: number) {
  return this.http.get(`${ApiService.BASE_URL}/clientes/${id}/projetos`, {
    headers: this.getHeader(),
  });
}

addCliente(body: any) {
  return this.http.post(`${ApiService.BASE_URL}/clientes/add`, body, {
    headers: this.getHeader(),
  });
}

updateCliente(id: number, body: any) {
  return this.http.put(`${ApiService.BASE_URL}/clientes/atualizar/${id}`, body, {
    headers: this.getHeader(),
  });
}





  /**PRODUTOS ENDPOINTS */
  addProduto(formData: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/produtos/add`, formData, {
      headers: this.getHeader(),
    });
  }

  updateProduto(formData: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/produtos/atualizar`, formData, {
      headers: this.getHeader(),
    });
  }

  getAllProduto(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/produtos/todos`, {
      headers: this.getHeader(),
    });
  }

  getProdutoById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/produtos/${id}`, {
      headers: this.getHeader(),
    });
  }

  deleteProduto(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/produtos/deletar/${id}`, {
      headers: this.getHeader(),
    });
  }




    /**Orcamentos Endpoints */

  purchaseProduto(body: any): Observable<any> {
    return this.http.post(
      `${ApiService.BASE_URL}/orcamentos/compra`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  sellProduto(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/orcamentos/venda`, body, {
      headers: this.getHeader(),
    });
  }

  getAllOrcamento(searchText: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/orcamentos/todos`, {
      params: { searchText: searchText },
      headers: this.getHeader(),
    });
  }

  getOrcamentoById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/orcamentos/${id}`, {
      headers: this.getHeader(),
    });
  }

  
  updateOrcamentoStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/orcamentos/atualizar/${id}`, JSON.stringify(status), {
      headers: this.getHeader().set("Content-Type", "application/json")
    });
  }


  getOrcamentoByMonthAndYear(month: number, year: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/orcamentos/by-month-year`, {
      headers: this.getHeader(),
      params: {
        month: month,
        year: year,
      },
    });

  }

  /** IMAGEM ENDPOINT */
gerarImagem(prompt: string): Observable<string> {
  return this.http.get(`${ApiService.BASE_URL}/imagem`, {
    params: { prompt },
    responseType: 'text', // porque seu backend retorna a URL como string
    headers: this.getHeader() // se precisar autenticação
  });
}



  /**AUTHENTICATION CHECKER */
    
  logout():void{
    this.clearAuth()
  }

  isAuthenticated():boolean{
    const token = this.getFromStorageAndDecrypt("token");
    return !!token;
  }

  isAdmin():boolean {
    const role = this.getFromStorageAndDecrypt("role");
    return role === "ADMIN";
  }
}


import { Injectable } from '@angular/core';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import {Http, Headers} from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {Book} from '../models/book';
import { Observable, of } from 'rxjs';
import { map } from "rxjs/operators";
import 'rxjs/add/operator/map';

@Injectable()
export class AddBookService {
  baseUrl: string = 'http://18.224.185.169:9000/book';
  constructor(private http: Http) { }
  createUser(book: Book) {
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      return this.http.post(this.baseUrl, book, {headers: headers});
   }

}

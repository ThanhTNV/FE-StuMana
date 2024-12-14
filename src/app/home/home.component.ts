import {Component, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Room, RoomInsertData} from '../../types/room.types';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  api_url = 'http://api-document-management.evericks.com'

  rooms = signal<Room[]>([])
  roomForm!: FormGroup;

  //DI - Dependency Injection
  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.getRooms();
    this.initForm();
  }

  initForm() {
    this.roomForm = this._formBuilder.group({
      name: [null, [Validators.required]],
    });
  }

  getRooms() {
    this._httpClient.get<Room[]>(`${this.api_url}/api/rooms`).subscribe({
      error: error => {
        // console.log(error);
        this.rooms.set(error.error);
        // console.log(this.rooms());
      },
      next: result => {
        // console.log(result);
      }
    })
  }

  deleteRoom(room: Room) {
    this._httpClient.delete<void>(`${this.api_url}/api/rooms/${room.id}`).subscribe({
      error: error => {
        this.getRooms();
      },
      next: result => {
        this.getRooms();
      },
    })
  }

  getProps() {
    let props = Object.keys(this.rooms()[0]);
    props = props.map(prop => {
      return prop.charAt(0).toUpperCase() + prop.slice(1);
    });
    return props;
  }

  onInsertRoom() {
    const roomPayload: RoomInsertData = this.roomForm.value;
    if (!this.roomForm.valid) {
      return;
    }
    // console.log(roomPayload);
    this._httpClient.post<Room>(`${this.api_url}/api/rooms`, roomPayload).subscribe({
      error: error => {
        this.getRooms();
        // this.roomForm.reset();
      },
      next: result => {
        this.getRooms();
        this.rooms().push(result);
      }
    })
  }
}


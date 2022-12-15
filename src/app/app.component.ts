import { Component } from '@angular/core';
import { Firestore, collectionData, collection, setDoc, doc, deleteDoc, getDoc, updateDoc, deleteField } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  todos$: Observable<any>;
  todos;
  todotext = '';
  // Dollarzeichen hat nichts zu bedeuten, man könnte es theoretisch auch weg lassen 
  // Wir legen uns ein Variable Item an mit dem Datentyp Observable d.h. sobald sich was in der Datenbank ändern sollte, wird die Variable geupdatet.
  // Damit man eine Variable vom Datentyp Observable schneller erkennt macht man traditionsweise eine Dollarzeichen dahinter, mehr hat das $ nicht zu bedeuten
  // <any> bedeutet dass hier alles drin sein kann also z.B. ein string oder eine number und und und
  constructor(private firestore: Firestore) {
    // Mitdem was hier im constructor steht importieren wir unser Firestore / Datenbank
    // Wir definieren uns eine Variable firestore und die Variable hat jetzt ein Object mit ganz vielen Funktionen die wir nun verwenden können
    // Die Library Firestore wurde auch am Kopf der Datei importiert
    const coll = collection(firestore, 'todos');
    // wir haben eine constante coll die mit der Funktion collection auf eine bestimmte Sammlung von Firestore(Datenbank) zugreift und wir greifen hier auf die Sammlung zu 
    this.todos$ = collectionData(coll);
    // hier weisen wir der Variable todos mithilfe von collectionData(coll) alle Daten zu, die unter der Sammlung todos steht

    this.todos$.subscribe((newTodos) => {
      console.log('Neue Todos sind:', newTodos);
      this.todos = newTodos;
    })

    // mit subscribe abonieren wir quasi unsere Datenbank d.h. sobald sich in der Datenbank was ändert wird diese Funktion sofort ausgeführt
    // wenn z.B. ein neues Todo dazu kommt oder eine bestehende todo sich ändert dann wird die Funktion in Echtzeit wieder aufgerufen und wir bekommen in unserem Fall ein console.log
    // Wir legen noch eine Variable an, hier todos, damit wir eine globale Variable haben, wo wir auch vom HTML Teil drauf zugreifen können
  }

  addTodo() {
    if (this.todotext.length > 0) {
      const coll = collection(this.firestore, 'todos');
      setDoc(doc(coll), { name: this.todotext });
      // Als erstes greifen wir auf die Sammlung zu worin wir was hinzufügen möchten
      // Mit setDoc erstellen wir in unserer Sammlung ein neues Dokument mit dem Feld "name" und den Wert todotext den der User ins Inputfeld eingetragen hat
      this.todotext = '';
    }
  }

  removeTodo(index) {
    console.log(index);
    const coll = collection(this.firestore, 'todos');

    // const docRef = doc(coll, "Coden");
    // const docSnap = getDoc(docRef);
    // console.log(docSnap);


    // ----- LÖSCHEN FUNKTION
    // deleteDoc(doc(coll, "DokumentenID"));

    // ----- DELETE JS EDITION
    // this.todos.splice(index, 1);
  }
}

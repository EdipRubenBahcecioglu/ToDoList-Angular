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
  todosDelete$: Observable<any>;
  deleteTodos;
  todosArchive$: Observable<any>;
  archiveTodos;

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
    this.todos$ = collectionData(coll, {idField: "customidField"});
    // hier weisen wir der Variable todos mithilfe von collectionData(coll) alle Daten zu, die unter der Sammlung todos steht
    // zusätzlich geben wir die DokumentenID vom jeweiligen Feld mit, hier definieren wir die ID Nummer als "customidField"

    this.todos$.subscribe((newTodos) => {
      console.log('Neue Todos sind:', newTodos);
      this.todos = newTodos;
    });
    // mit subscribe abonieren wir quasi unsere Datenbank d.h. sobald sich in der Datenbank was ändert wird diese Funktion sofort ausgeführt
    // wenn z.B. ein neues Todo dazu kommt oder eine bestehende todo sich ändert dann wird die Funktion in Echtzeit wieder aufgerufen und wir bekommen in unserem Fall ein console.log
    // Wir legen noch eine Variable an, hier todos, damit wir eine globale Variable haben, wo wir auch vom HTML Teil drauf zugreifen können

    // AUSFÜHRLICHE KOMMENTIERUNG SIEHE AB ZEILE 19, HIER WIEDERHOLUNG
    const collTrash = collection(firestore, 'todosDelete');
    // wir weisen der Variable collTrash die Datenbanksammlung todosDelete zu
    this.todosDelete$ = collectionData(collTrash, {idField: 'customidField'});
    // der Observablevariable geben wir alle Daten, die in der todosDelete Datenbanksammlung enthalten sind
    // mit idField: 'customidField' können wir auf einzelne Dokumente zugreifen
    this.todosDelete$.subscribe((deleteTodo =>{
      console.log('Gelöschte Todo ist:', deleteTodo);
      this.deleteTodos = deleteTodo;
    }));
    // Wir abonieren die Datenbanksammlung todosDelete d.h. sobald hier was geändert wird, wird alles innerhlab der subscribe Funktion ausgeführt
    // Wir legen noch eine Variable an, hier todos, damit wir eine globale Variable haben, wo wir auch vom HTML Teil drauf zugreifen können

    const collArchive = collection(firestore, 'todosArchive');
    this.todosArchive$ = collectionData(collArchive, {idField: 'customidField'});
    this.todosArchive$.subscribe((archiveTodo =>{
      console.log('Archvierter Todo ist', archiveTodo);
      this.archiveTodos = archiveTodo;
    }))
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

  async removeTodo(index, taskName) {
    const collRef = collection(this.firestore, 'todos');
    // Wir legen in der Variable fest auf welche Collection bzw. Sammlung wir zugreifen möchten
    const docRef = doc(collRef, this.todos[index]['customidField']);
    // Wir legen in der Variable fest, dass wir auf das 'customidField' zugreifen möchten, was in Zeile 24 durch uns frei vergeben wurde
    await deleteDoc(docRef);
    // wir löschen das Dokument, welches in der docRef festgehalten wurde

    const collTrash = collection(this.firestore, 'todosDelete');
    setDoc(doc(collTrash), {name: taskName});
    // hier fügen wir der Datenbanksammlung 'todosDelete' die gelöschte Todo hinzu
  }

  async undoDelete(index, taskName){
    const coll = collection(this.firestore, 'todos');
    const collRef = collection(this.firestore, 'todosDelete');
    const docRef = doc(collRef, this.deleteTodos[index]['customidField']);
    await deleteDoc(docRef);
    setDoc(doc(coll), {name: taskName});
    // hier entnehmen wir aus Delete Collection eine Todo und geben es der 'normalen' collection wieder rein
  }

  async archiveTodo(index, taskName){
    const collRef = collection(this.firestore, 'todos');
    const docRef = doc(collRef, this.todos[index]['customidField']);
    await deleteDoc(docRef);

    const collArchive = collection(this.firestore, 'todosArchive');
    setDoc(doc(collArchive), {name: taskName});
  }

  async undoArchive(index, taskName){
    const coll = collection(this.firestore, 'todos');
    const collRef = collection(this.firestore, 'todosArchive');
    const docRef = doc(collRef, this.archiveTodos[index]['customidField']);
    await deleteDoc(docRef);
    setDoc(doc(coll), {name: taskName});
  }
}

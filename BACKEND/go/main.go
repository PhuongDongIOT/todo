// basic-middleware.go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "html/template"
    
    "github.com/rs/cors"
    "github.com/gorilla/sessions"
)

var (
    key = []byte("super-secret-key")
    store = sessions.NewCookieStore(key)
)

type User struct {
    Firstname string `json:"firstname"`
    Lastname  string `json:"lastname"`
    Age       int    `json:"age"`
}

type Todo struct {
    Title string
    Done  bool
}

type TodoPageData struct {
    PageTitle string
    Todos     []Todo
}

func logging(f http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println(r.URL.Path)
        f(w, r)
    }
}

func foo(w http.ResponseWriter, r *http.Request) {
    session, _ := store.Get(r, "cookie-name")
    log.Println(session.Values["authenticated"])
    fmt.Fprintln(w, "foo")
}

func bar(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "bar")
}

func objjson(w http.ResponseWriter, r *http.Request) {
    peter := User{
        Firstname: "John",
        Lastname:  "Doe",
        Age:       25,
    }

    json.NewEncoder(w).Encode(peter)
}

func hadlingview(w http.ResponseWriter, r *http.Request) {
    tmpl := template.Must(template.ParseFiles("layout.html"))
    data := TodoPageData{
        PageTitle: "My TODO list",
        Todos: []Todo{
            {Title: "Task 1", Done: false},
            {Title: "Task 2", Done: true},
            {Title: "Task 3", Done: true},
        },
    }
    tmpl.Execute(w, data)
}

func login(w http.ResponseWriter, r *http.Request) {
    session, _ := store.Get(r, "cookie-name")
    session.Values["authenticated"] = true
    session.Save(r, w)
}

func logout(w http.ResponseWriter, r *http.Request) {
    session, _ := store.Get(r, "cookie-name")

    session.Values["authenticated"] = false
    session.Save(r, w)
}

func main() {
    mux := http.NewServeMux()
    fs := http.FileServer(http.Dir("assets/"))
    mux.Handle("/static/", http.StripPrefix("/static/", fs))
    mux.HandleFunc("/login", logging(login))   
    mux.HandleFunc("/logout", logging(logout))
    mux.HandleFunc("/foo", logging(foo))
    mux.HandleFunc("/bar", logging(bar))
    mux.HandleFunc("/json", logging(objjson))
    mux.HandleFunc("/view", logging(hadlingview))

    handler := cors.Default().Handler(mux)
    http.ListenAndServe(":8080", handler)
}
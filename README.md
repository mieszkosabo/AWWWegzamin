# Zadania #

## Minimum na 3 ##

- dodałem mechanizm sesji, logowania i wylogowania i informacji o nieprawidłowych danych.
- paginację zaimplementowałem jako /entries/:numer_strony
- szczegóły paginacji zgodne z wiadomościami na rocketczacie
- od razu zaimplementowałem system wyświetlania najnowszych wpisów jak podpkt JSON
  
## Pug +0.5 ##

- moje szablony pug używają layoutu, w której jest też responsywna stopka
- paginacja jest jako includowalny szablon pug, dzięki czemu łatwo użyć tego systemu na innych podstronach
- dołączenie css polega na tym, że wszystkie szablony dziedziczą po layout, który go załącza 

## JSON +0.5 ##

- mam oddzielny router, który reaguje na żądania uzyskania 5 najnowszych wpisów i wysyła je jako json
- na frontendzie jest wysyłane asynchroniczne żądanie do serwera i po uzyskaniu odpowiedzi JS renderuje wpisy

## Formularz +0.5 ##

- można usuwać swoje wpisy i dodwać nowe
- wszystkie formularze (łącznie z logowaniem) są odporne na CSRF i SQLinjection

MIESZKO SABO 406322
# AWWWegzamin

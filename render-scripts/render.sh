#!/usr/bin/env bash

h() {
    printf "$@"
}

render() {
    title=$(grep -oP "(?<=^# ).*" -m 1 "$1")
    h '<!DOCTYPE html>'
    h '<html lang="en">'
    h     '<head>'
    h         '<meta charset="utf-8">'
    h         '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    h         "<title>$title</title>"
    h         '<link href="../shared/base.css" rel="stylesheet"></link>'
    h         '<link rel="preconnect" href="https://fonts.googleapis.com">'
    h         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    h         '<link href="https://fonts.googleapis.com/css2?family=Fira+Sans&family=JetBrains+Mono&display=swap" rel="stylesheet">'
    h         '<link href="./favicon.svg" rel="icon">'
    h     '</head>'
    h     '<body>'
    h         '<div id="content">'
    ./bin/comrak --unsafe --syntax-highlighting "base16-ocean.dark" "$1"
    h         '</div>'
    h     '</body>'
    h '</html>'
}

render "$1" | node postprocess.js

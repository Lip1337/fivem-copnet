fx_version 'cerulean'
game 'gta5'

client_scripts {
    "client.lua"
}

shared_scripts {
    "@es_extended/imports.lua"
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server.lua"
}

ui_page 'html/index.html'

files {
    "html/*.*",
    "html/img/*.*"
}
ESX.RegisterServerCallback("tablet:fetchApp:pd", function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    print(xPlayer.getJob().name)
    if xPlayer.getJob().name == "police" then
        MySQL.Async.fetchAll("SELECT * FROM users WHERE identifier = @identifier",{["@identifier"] = xPlayer.identifier}, function(result)
            MySQL.Async.fetchAll("SELECT * FROM users", function(result2)
                local data = {
                    userdata = result[1],
                    users = result2,
                    app = "pd"
                }
                data.userdata.rank = xPlayer.getJob().grade_label
                cb(data)
            end)
        end)   
    else
        cb(false)
        xPlayer.showNotification("Du hast darauf keinen Zugriff.")
    end
end)

ESX.RegisterServerCallback("tablet:fetchUser", function(source, cb, identifier)
    MySQL.Async.fetchAll("SELECT * FROM users WHERE identifier = @identifier", {["@identifier"] = identifier}, function(result)
        cb(result[1].akte)
    end)
end)

RegisterNetEvent("tablet:pd:addEntry", function(data)
    local data = data.data
    data.date = os.date("%x")
    MySQL.Async.fetchAll("SELECT * FROM users WHERE identifier = @identifier",{["@identifier"] = data.id}, function(result)
        local entrys = json.decode(result[1].akte)
        table.insert(entrys, data)
        MySQL.execute("UPDATE users SET akte = @akte WHERE identifier = @identifier", {["@identifier"] = data.id, ["@akte"] = json.encode(entrys)})
    end)
end)

RegisterNetEvent("tablet:load", function()
    local data = {
        time = os.date("%H:%M  %a %b %d")
    }
    TriggerClientEvent("tablet:cl:load", source, data)
end)
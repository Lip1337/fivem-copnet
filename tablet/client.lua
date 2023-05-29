local open = false

function setDisplay(bool)
    open = bool
    SendNUIMessage({
        type = "ui",
        status = bool
    })
    SetNuiFocus(bool, bool)
end

RegisterKeyMapping("+tapopen", "Öffne dein Tablet", "keyboard", "f4")
RegisterCommand("+tapopen", function()
    setDisplay(true)
    TriggerServerEvent("tablet:load")
    Citizen.Wait(1000)
    while open do 
        TriggerServerEvent("tablet:load")
        Citizen.Wait(1000)
    end
end, false)

RegisterNetEvent("tablet:cl:load", function(data)
    SendNUIMessage({
        type = "load",
        data = data
    })
end)

RegisterNuiCallback("close", function()
    setDisplay(false)
end)

RegisterNuiCallback("fetchData", function(data)
    if data.name then 
        ESX.TriggerServerCallback("tablet:fetchApp:" .. data.name, function(cb) 
            if cb then 
                SendNUIMessage({
                    type = "sendData",
                    data = cb
                })
            else
                setDisplay(false)
            end
        end)
    end
end)

RegisterNuiCallback("fetchUser", function(data)
    if data.identifier then 
        ESX.TriggerServerCallback("tablet:fetchUser", function(cb) 
            if cb then 
                SendNUIMessage({
                    type = "sendUser",
                    data = cb
                })
            end
        end, data.identifier)
    end
end)

RegisterNuiCallback("adduserentry", function(data)
    TriggerServerEvent("tablet:pd:addEntry", data)
end)
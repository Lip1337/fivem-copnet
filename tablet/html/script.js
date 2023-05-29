var currentapp
var pduser
var tpduser = {}

function openApp(name) {
    $.post("https://tablet/fetchData", JSON.stringify({
        name: name
    }))
}

setDisplay(false)

function selectUser(id, name, job, number, jail, credit) {
    if (id) {
        tpduser.name = name
        tpduser.job = job
        tpduser.number = number
        tpduser.jail = jail
        tpduser.credit = credit
        pduser = id
        $(".users").fadeOut(200)
        $.post("https://tablet/fetchUser", JSON.stringify({
            identifier: id
        }))
        $(".u-name").html(name)
        $(".u-job").html(job)
        $(".u-number").html(number)
        $(".u-jail").html(jail)
        $(".u-credit").html(credit)
        $(".pd-userdata").fadeIn(200)
    }
}

function setDisplay(bool) {
    if (bool) {
        $("body").fadeIn(200)
    } else {
        $("body").fadeOut(200)
    }
}

window.addEventListener("message", (event) => {
    var item = event.data
    if (item.type == "ui") {
        setDisplay(item.status)
    }
    if (item.type == "sendUser") {
        $(".user-t-data").empty()
        $(".user-t-data").append(`                            
        <thead>
            <td>Titel</td>
            <td>Nachricht</td>
            <td>Strafe</td>
            <td>Tag und Zeit</td>
        </thead>`)
        JSON.parse(item.data).forEach(entry => {
            $(".user-t-data").append(`
            <tr>
            <td>${entry.title}</td>
            <td>${entry.message}</td>
            <td>${entry.strafe} Hafteinheiten</td>
            <td>${entry.date}</td>
        </tr>
            `)
        })
    }
    if (item.type == "sendData") {
        if (item.data.app == "pd") {
            currentapp = "pd"
            $(".apps").hide(200)
            setTimeout(() => {
                $(".pd").fadeIn(200)
                if (item.data) {
                    var data = item.data
                    var userdata = data.userdata
                    if (userdata.rank) {
                        $(".rank").html(userdata.rank)
                        $(".name").html(userdata.firstname + " " +  userdata.lastname)
                    }
                    $(".add-entry").click(() => {
                        $(".pd-modal").css("display", "block")
                    })
                    $(".add").click(() => {
                        var data = {
                            title: $(".ititle").val(),
                            message: $(".imessage").val(),
                            strafe: $(".ijail").val(),
                            id: pduser
                        }
                        $.post("https://tablet/adduserentry", JSON.stringify({
                            data: data
                        }))
                        $(".pd-modal").fadeOut(200)
                        setTimeout(() => {
                            selectUser(pduser, tpduser.name, tpduser.job, tpduser.number || "Anonym", tpduser.jail, tpduser.credit)
                        }, 1000)
                    })
                    $(".back").click(() => {
                        $(".pd-modal").fadeOut(200)
                    })
                    $(".pd-userdata").fadeOut(200)
                    if (data.users) {
                        $(".users").fadeIn(200)
                        $(".user-table").empty()
                        $(".user-table").append(`                        <thead class="activerow">
                        <td style="color: #da9226;">Name</td>
                        <td style="color: #da9226;">Beruf</td>
                        <td style="color: #da9226;">Nummer</td>
                        <td style="color: #da9226;">Gefängniszeit</td>
                        <td style="color: #da9226;">Kredit</td>
                        </thead>`)
                        data.users.forEach(user => {
                            $(".user-table").append(`
                            <tr onclick="selectUser('${user.identifier}', '${user.firstname} ${user.lastname}', '${user.job}', '${user.phone_number || "Anonym"}', '${user.jail}', '${user.credit}')">
                            <td>${user.firstname} ${user.lastname}</td>
                            <td>${user.job}</td>
                            <td>${user.phone_number || "Anonym"}</td>
                            <td>${user.jail}</td>
                            <td>${user.credit}</td>
                            </tr>
                            `)
                        });
                    }
                } 
            }, 1000)
        }
    }
    if (item.type == "load") {
        if (item.data.time) {
            $(".time").html(item.data.time)
        }
    }
})

$(document).keyup(function(e) {
    if (e.key === "Escape") {
        $.post("https://tablet/close")
    }
});

function back() {
    $("." + currentapp).fadeOut(200)
    $(".apps").fadeIn(200)
}
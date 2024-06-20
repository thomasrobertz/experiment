import { WebContainer } from "@webcontainer/api";

window.addEventListener("load", async () => {
    console.log("booting...")
    const wc = await WebContainer.boot();
    console.log("done")

    const rC = async (cmd: string, args: string[]) => {

        const p = await wc.spawn(cmd, args)
        p.output.pipeTo(new WritableStream({
            write: (chunk) => {
                outputPanel.textContent += "\n" + chunk
            }
        }))

        if (await p.exit) {
            console.log("Spwaning node failed")
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const cmd = command.value.split(' ')[0]
        const args = command.value.split(' ').slice(1)
        await rC(cmd, args)
    })
})

console.log("EOF")
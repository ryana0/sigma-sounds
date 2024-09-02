const drumNameCatalog = {
    'kick': [],
    'snare': [],
    'hihat': [],
    'bassKick': []
}

const drumCatalog = {
    'kick': [],
    'snare': [],
    'hihat': [],
    'basskick': []
}

function isPlaying(audioEl) {
    return !audioEl.paused;
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });

function bpm2tbhb(bpm) {
    tbhb = ((960 / (bpm * 2)) / 16) * 1000
    return tbhb
}



class Sequence {
    constructor(bpm) {
        this.bpm = bpm
        this.tbhb = bpm2tbhb(bpm)
        this.interval
        this.index = 0
    }

    changeBpm(newBpm) {
        this.bpm = newBpm
        this.tbhb = bpm2tbhb(newBpm)
    }

    start() {
        this.index = 0
            this.interval = setInterval(() => {
                
                console.log(this.index)
                Object.keys(drumCatalog).forEach((key) => {
                    drumCatalog[key].forEach((item) => {
                        const drumSeq = item.sequence
                        
                        if(drumSeq[this.index] == 1) {
                            item.play()
                        }
                    })
                })
                if(this.index == 15) {
                    this.index = 0
                } else {
                    this.index++
                }
            }, this.tbhb);
    }

    stop() {
        clearInterval(this.interval)
    }
}

const timeSeq = new Sequence(document.getElementById('bpm').dataset.bpm)

const playAll = document.getElementById('playAll')
playAll.addEventListener('click', () => {
    if(playAll.dataset.playing == 'false') {
        timeSeq.start()
        playAll.src = 'assets/pause.svg'
        playAll.dataset.playing = 'true'
    } else {
        timeSeq.stop()
        playAll.src = 'assets/playAll.svg'
        playAll.dataset.playing = 'false'
    }
})

class Drum {
    constructor(type, audio, id) {
        this.sequence = []
        for(let i = 0; i < 16; i++) {this.sequence.push(0)}
        this.type = type
        this.audio = new Audio(audio)
        this.id = id
        if(type == 'basskick') {
            this.prefVol = 1
        } else if (type == 'kick') {
            this.prefVol = 0.25
        } else if (type == 'snare') {
            this.prefVol = 0.25
        } else if (type == 'hihat') {
            this.prefVol = 1
        }
        this.audio.volume = this.prefVol

        const drumElement = document.createElement('div')
        drumElement.classList.add('drum')

        const drumIcon = document.createElement('img')
        drumIcon.classList.add('drumIcon')
        drumIcon.src = 'assets/' + this.type + '.svg'

        const drumName = document.createElement('h1')
        if(this.type != 'basskick') {
            drumName.textContent = 'Sigma ' + this.type.capitalize()
        } else {
            drumName.textContent = 'Sigma 808'
        }
        drumName.classList.add('drumName')

        const play = document.createElement('img')
        play.src = 'assets/play.svg'
        play.classList.add('play')

        play.addEventListener('click', () => {
            if(isPlaying(this.audio)) {
                const newNode = this.audio.cloneNode()
                newNode.volume = this.prefVol
                newNode.play()
            } else {
                this.play()
            }
        })

        const deleteBtn = document.createElement('img')
        deleteBtn.src = 'assets/delete.svg'
        deleteBtn.classList.add('delete')

        document.getElementById('instruments').appendChild(drumElement)
        drumElement.appendChild(drumIcon)
        drumElement.appendChild(drumName)
        drumElement.appendChild(play)
        drumElement.appendChild(deleteBtn)

        const beatSequence = document.createElement('div')
        beatSequence.classList.add('beatSequence')

        for(let i = 0; i < 16; i++) {
            const halfBeat = document.createElement('div')
            halfBeat.classList.add('halfBeat')
            halfBeat.classList.add(this.type + '-' + i)
            halfBeat.addEventListener('click', () => {
                if(halfBeat.classList.contains('active')) {
                    halfBeat.classList.remove('active')
                    this.sequence[halfBeat.classList[1].split('-')[1]] = 0
                } else {
                    halfBeat.classList.add('active')
                    this.sequence[halfBeat.classList[1].split('-')[1]] = 1
                }
            })
            beatSequence.appendChild(halfBeat)
        }



        document.getElementById('sequencer').appendChild(beatSequence)
    }

    play() {
        console.log(this.audio.volume)
        this.audio.play()
    }

    delete() {
        this.delete()
    }
}

function createID() {
    id = []
    id.push(Math.ceil(Math.random() * 10) - 1)
    id.push(Math.ceil(Math.random() * 10) - 1)
    id.push(Math.ceil(Math.random() * 10) - 1)
    id.push(Math.ceil(Math.random() * 10) - 1)
    id = id.join('')
    Object.keys(drumNameCatalog).forEach((drum) => {
        drumNameCatalog[drum].forEach((sound) => {
            drumID = sound.split('-')[1]
            if(drumID == id) {
                return
            } else {
                return id
            }
        })
    })
}

function createSigmaDrum(type) {
    id = createID()
    if(!id) {
        newID = createID()
        const drum = new Drum(type, 'bank/' + type + '.wav', newID)
        drumCatalog[type].push(drum)
    } else {
        const drum = new Drum(type, 'bank/' + type + '.wav', id)
        drumCatalog[type].push(drum)
    }
}

createSigmaDrum('basskick')
createSigmaDrum('kick')
createSigmaDrum('snare')
createSigmaDrum('hihat')

const bpm = document.getElementById('bpm')
bpm.addEventListener('click', () => {
    bpm.children[1].value = ''
    bpm.children[1].style.display = 'inline-block'
    bpm.addEventListener('keypress', (event) => {
        if (event.key == 'Enter') {
            bpm.children[1].style.display = 'none'
            bpm.children[0].textContent = 'BPM: ' + bpm.children[1].value
            bpm.dataset.bpm = bpm.children[1].value
            timeSeq.changeBpm(bpm.children[1].value)
        }
    })
})

bpm.addEventListener('focusout', () => {
    bpm.children[1].style.display = 'none'
    bpm.children[0].textContent = 'BPM: ' + bpm.children[1].value
    bpm.dataset.bpm = bpm.children[1].value
    timeSeq.changeBpm(bpm.children[1].value)
})




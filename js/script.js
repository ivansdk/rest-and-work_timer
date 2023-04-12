// -----Timer------

const time = document.querySelector('.time'), 
      btnContainer = document.querySelector('.btn-container'),
      statusContainer = document.querySelector('.status-container'),
      workStatus = statusContainer.querySelector('.work'),
      restStatus = statusContainer.querySelector('.rest'),
      chgBtn = document.querySelector('#chg-btn'),
      title = document.querySelector('title');


const wrapper = document.querySelector('.wrapper'), 
      workInput = document.querySelector('#work'),
      restInput = document.querySelector('#rest'),
      checkboxNext = document.querySelector('#next'),
      soundSelect = document.querySelector('#soundType'),
      checkboxSoundPlay = document.querySelector('#sound-play'),
      volumeRange = document.querySelector('#volume');
      

let workTime = 60,
    restTime = 15,
    intervalId,
    data,
    theme,
    switchTimer = true,
    soundPlay = true,
    volume = 60,
    soundType,
    sound  = new Audio('./audio/beautiful-piano.mp3');

    sound.volume = volume * 0.01;




function convertTimeInData() {
    if(workStatus.classList.contains('active-status')){
        if(isNaN(workTime)){
           workTime = 0; 
        }
        data = workTime * 60;
    }else{
        if(isNaN(restTime)){
            restTime = 0; 
         }
        data = restTime * 60;
    }

}


function convertDateInReadableTime() {
    let hours, minutes, seconds;

    if(data < 1) {
        hours = 0;
        minutes = 0;
        seconds = 0;
    }else{
        hours = Math.floor(data / (60 * 60));
        minutes = Math.floor((data / 60) % 60);
        seconds = Math.floor(data % 60);
    }

    return [hours, minutes, seconds];
}


function addZero(value) {
    if (value < 10) {
        return `0${value}`;
    }else{
        return value;
    }
}


function setTimer() {
    const timeArr = convertDateInReadableTime();
    
    if(timeArr[0] < 1){
        time.textContent = `${addZero(timeArr[1])}:${addZero(timeArr[2])}`;
    }else{
        time.textContent = `${timeArr[0]}:${addZero(timeArr[1])}:${addZero(timeArr[2])}`;
    }

    title.textContent = `${time.textContent} | Work/Rest Timer`;
}


function changeStatus() {
    if(workStatus.classList.contains('active-status')){

        workStatus.classList.remove('active-status');
        restStatus.classList.add('active-status');
        convertTimeInData();

    }else{

        restStatus.classList.remove('active-status');
        workStatus.classList.add('active-status');
        convertTimeInData();

    }
}


function stopTimer(setTimer = true){

    clearInterval(intervalId);
    chgBtn.classList.remove('stop-btn');
    chgBtn.classList.add('start-btn');
    chgBtn.textContent = 'Start';

    if(setTimer){
        convertTimeInData();
    }
}


btnContainer.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('start-btn')) {

        target.classList.remove('start-btn');
        target.classList.add('stop-btn');
        target.textContent = 'Stop';

        intervalId = setInterval(() => {
            data -= 1;
            
            if(Math.floor(data <= -1)) {

                if(document.hidden){
                    const storage = JSON.parse(localStorage.getItem('settings'));

                    if(storage){
                        sound = new Audio(storage.sound);
                        sound.volume = storage.volume * 0.01;
                    }else{
                        sound = new Audio('./audio/beautiful-piano.mp3');
                        sound.volume = 0.6;
                    }

                }

                if(soundPlay){
                    sound.play();
                }

                if(switchTimer){
                    changeStatus();
                }else{
                    stopTimer();
                }
            }

            setTimer();
        },1000);

    }else if (target.classList.contains('stop-btn'))  {

        stopTimer(false);

    }else if (target.classList.contains('reset-btn')) {

        stopTimer();
        setTimer();

    }
});


statusContainer.addEventListener('click', (e)=>{
    const target = e.target;

    if(chgBtn.classList.contains('stop-btn')){
        stopTimer(false);
    }

    if(target.classList.contains('work') &&
        !target.classList.contains('active-status') ||
        target.classList.contains('rest') &&
        !target.classList.contains('active-status')
    ){
        changeStatus();
    }
    

    setTimer();
});

getLocalStorage();
convertTimeInData();
setTimer();
// ----------


// -----Modal-----

const settingsBtn = document.querySelector('.settings-btn'),
      closeButton = document.querySelector('.modal-close'),
      overlay = document.querySelector('.overlay'),
      modal = document.querySelector('.modal'),
      checkboxs = document.querySelectorAll('.checkbox'),
      saveBtn = modal.querySelector('.save-btn');



function closeModal() {
    overlay.classList.remove('overlay_active');
    modal.classList.remove('modal_active');
}


function cleanUnsavedSettings() {

    const storage = JSON.parse(localStorage.getItem('settings')),
          NextParent = checkboxNext.parentNode,
          SoundPlayParent = checkboxSoundPlay.parentNode;

    if(storage != null) {

        workInput.value = storage.workTime;
        restInput.value = storage.restTime;
        switchTimer = storage.switchTimer;
        soundPlay = storage.soundPlay;

        if(switchTimer){
            NextParent.classList.add('checked');
            checkboxNext.checked = true;
        }else{
            NextParent.classList.remove('checked');
            checkboxNext.checked = false;
        }

        if(soundPlay){
            SoundPlayParent.classList.add('checked');
            checkboxSoundPlay.checked = true;
        }else{
            SoundPlayParent.classList.remove('checked');
            checkboxSoundPlay.checked = false;
        }

        sound.src = storage.soundType;
        sound.volume = storage.volume * 0.01;
        volumeRange.value = storage.volume;

    }else{
        workInput.value = workTime;
        restInput.value = restTime;
        NextParent.classList.add('checked');
        checkboxNext.checked = true;

        SoundPlayParent.classList.add('checked');
        checkboxSoundPlay.checked = true;
        sound.src = './audio/beautiful-piano.mp3';
        sound.volume = 0.6;
        volumeRange.value = 60;
    }
}


function checkSelected(selector) {
    const select = modal.querySelector(selector),
          options = select.querySelectorAll('option'),
          storage = JSON.parse(localStorage.getItem('settings'));

    if(storage){

        options.forEach(option => {
            option.selected = false;
        });

        options.forEach(option => {
            if(option.value === storage[select.id]) {
                option.selected = true;
            }
        });
    }else{
        options[1].selected = true;
    }
}





settingsBtn.addEventListener('click',() => {
    overlay.classList.add('overlay_active');
    modal.classList.add('modal_active');

    checkSelected('select#theme');
    checkSelected('select#soundType');

    const tabs = modal.querySelectorAll('.tab'),
          tabContents = modal.querySelectorAll('.tab-content'),
          inputs = modal.querySelectorAll('input');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) =>{
            const target = e.target;

            tabs.forEach(tab => {
                tab.classList.remove('active-tab');
            });

            if(target.dataset.id === tab.dataset.id){

                target.classList.add('active-tab');

                tabContents.forEach(content => {
                    content.style.display = 'none';
                    content.classList.remove('tab-content_active');

                    if(target.dataset.id === content.dataset.id) {
                        content.style.display = 'block';
                        setTimeout(() => {
                            content.classList.add('tab-content_active');
                        },1);
                    }

                }); 

            }
        });
    });
    
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d\.]/g,'');

            const dots = e.target.value.match(/\./g);
            if (dots && dots.length > 1) {
              e.target.value = e.target.value.slice(0, -1);
            }
        });
    });

});


closeButton.addEventListener('click',()=>{ 
    closeModal();
    cleanUnsavedSettings();
});


overlay.addEventListener('click', (e)=>{
    if(e.target.classList.contains('overlay')){
        closeModal();
        cleanUnsavedSettings();
    }
});


checkboxs.forEach(checkbox => {
    const input = checkbox.querySelector('input');
    
    if (input.checked) {
        checkbox.classList.add('checked');
        input.setAttribute('checked' ,'true');
    }else {
        checkbox.classList.remove('checked');
        input.removeAttribute('checked');
    }

    checkbox.addEventListener('click', (e) =>{
        const target = e.currentTarget;

        if(target.classList.contains('checked')){
            target.classList.remove('checked');
            input.removeAttribute('checked');
        }else{
            input.setAttribute('checked' ,'true');
            target.classList.add('checked');
        }
    });
});


saveBtn.addEventListener('click', ()=>{

    if(chgBtn.classList.contains('stop-btn')){
        stopTimer(false);
    }

    theme = modal.querySelector('#theme').value;
    wrapper.style.backgroundImage = `url(${theme})`;

    workTime = +workInput.value;
    restTime = +restInput.value;
    switchTimer = checkboxNext.getAttribute('checked');

    soundType = soundSelect.value;
    sound.src = soundSelect.value;
    volume = +volumeRange.value;
    soundPlay = checkboxSoundPlay.getAttribute('checked');
    
    convertTimeInData();
    setLocalStorage();
    setTimer();
    closeModal();
});


soundSelect.addEventListener('change', () => {
    sound.src = soundSelect.value;
    sound.play();
});


volumeRange.addEventListener('click', ()=>{
    sound.volume = volumeRange.value * 0.01;
    sound.play();
});


// ----------


//-----LocalStorage-----

function setLocalStorage() {
    localStorage.setItem('settings', JSON.stringify(
        {
            theme, 
            workTime, 
            restTime, 
            switchTimer, 
            soundType, 
            volume, 
            soundPlay
        }
        ));
}

function getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem('settings'));
    
    if(storage !== null){
        theme = storage.theme;
        wrapper.style.backgroundImage = `url(${theme})`;

        workTime = storage.workTime;
        restTime = storage.restTime;
        switchTimer = storage.switchTimer;
        convertTimeInData();

        sound.src = storage.soundType;
        sound.volume = storage.volume * 0.01;
        soundPlay = storage.soundPlay;

        workInput.value = workTime;
        restInput.value = restTime;
        checkboxNext.checked = switchTimer;

        checkboxSoundPlay.checked = soundPlay;
        volumeRange.value = storage.volume;
    }
    
}

// ----------

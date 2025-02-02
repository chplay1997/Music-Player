/**
         * 1. Render songs
         * 2. Scoll top
         * 3. Play / Pause / Seek
         * 4. CD rotate
         * 5. Next / prev
         * 6. Random
         * 7. Next / repeat when ended
         * 8. Active song
         * 9. Scroll Active song into view
         * 10. Play song when click
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Ahdam';

const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
            name: 'Tiếc Duyên',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/1_tiec_duyen.mp3",
            image: './assets/image/anh1.jpg'
        },
        {
            name: 'Ai Thật Lòng Thương Em',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/2.Ai_that_long_thuong_em.mp3",
            image: "./assets/image/anh2.jpg"
        },
        {
            name: 'Thành Cổ Tình Yêu',
            singer: 'Hứa Tiêu Nhi',
            path: "./assets/music/5.thanh_co_tinh_yeu.mp3",
            image: "./assets/image/anh5.jpg"
        },
        {
            name: 'Viên Đạn Phiêu Bạt',
            singer: 'Mạt + Lưu Húc Dương',
            path: "./assets/music/6.vien_dan_phieu_dat.mp3",
            image: "./assets/image/anh6.jpg"
        },
        {
            name: 'Tết Bình An',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/3.TEt_binh_an.mp3",
            image: "./assets/image/anh3.jpg"
        },
        {
            name: 'Cô Đơn Sẽ Tốt Hơn',
            singer: 'Kiều Mini',
            path: "./assets/music/7.co_don_se_tot_hon.mp3",
            image: "./assets/image/anh7.jpg"
        },
        {
            name: 'Cheer Up',
            singer: 'Hong Jin Young',
            path: "./assets/music/8.Cheer_up.mp3",
            image: "./assets/image/anh8.jpg"
        },
        {
            name: 'Như Bến Đợi Đò',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/4.Nhu_ben_doi_lo.mp3",
            image: "./assets/image/anh4.jpg"
        },
        {
            name: 'Vĩnh Biệt Màu Xanh Remix',
            singer: 'Phương Phương Thảo',
            path: "./assets/music/9.vinh_biet_mau_xanh.mp3",
            image: "./assets/image/anh9.jpg"
        },
        {
            name: 'Ngỡ Như Là Giấc Mơ',
            singer: 'Duyên Bún',
            path: "./assets/music/10.ngo_nhu_la_giac_mo.mp3",
            image: "./assets/image/anh10.jpg"
        },
        {
            name: 'Nocturne',
            singer: 'Secret Garden',
            path: "./assets/music/11.Secret Garden - Nocturne.mp3",
            image: "./assets/image/anh11.jpg"
        }
    ],
    setConfig: function(key,value) {
        this.setConfig[key]= value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },
    render:function(){
        const htmls =this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex?'active':''}" data-index = ${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML =htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý cd quay / dừng
        const cdThumbAnimate =  cdThumb.animate([{
            transform: 'rotate(360deg)'}]
        ,{
            duration: 10000,// 10 seconds
            iterations : Infinity
        })
        cdThumbAnimate.pause();

        //Xử lý phóng to / thu nhỏ CD
        document.onscroll  = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px':0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        //Khi song được play
        audio.onplay = function() {
            _this.isPlaying =true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //Khi song bị pause 
        audio.onpause = function() {
            _this.isPlaying =false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor( (audio.currentTime / audio.duration )*100);
                progress.value = progressPercent;
            }
        }
        //Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = (e.target.value*audio.duration)/100;
            audio.currentTime =seekTime;
        }
        //Khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSongs();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollTopActiveSong();
            
        }
        //Khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSongs();
            }
            else{
                _this.prevSong();
            }
            
            audio.play();
            _this.render();
            _this.scrollTopActiveSong();

        }
        //Xử lý bật / tắt random song
        randomBtn.onclick = function(e) {
            
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom);
            randomBtn.classList.toggle('active',_this.isRandom);
        }
        
        //Xử lý lặp lại 1 song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        //Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }
            else{
            nextBtn.click();
            }
        }

        // Lắng nghe hành vi click vao playlist
        playlist.onclick = function(e) {
            //Xử lý khi click vào song
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode ||  e.target.closest('.song:not(.option)') ) {
                //Xử lý khi vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //Xử lý khi vào song option
                if(e.target.closest('.song:not(.option)')){
                    
                }
            }
        }
        
    },
    scrollTopActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent =this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRandom = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;

        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSongs: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //lắng nghe /xử lý các sự kiện (DOM events)
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của button & random
        randomBtn.classList.toggle('active',this.isRandom);
        randomBtn.classList.toggle('active',this.isRepeat);
    }
}
app.start();

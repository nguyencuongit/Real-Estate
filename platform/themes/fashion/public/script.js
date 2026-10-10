'use strict';
(() => {
    const math = window.FashionMotionMath;
    const dialogs = [...document.querySelectorAll('dialog')];
    let opener = null;
    const status = document.querySelector('#fashion-status');
    let statusTimer;
    const toast = message => { status.textContent=message;status.classList.add('show');clearTimeout(statusTimer);statusTimer=setTimeout(()=>status.classList.remove('show'),4000); };
    function open(id, trigger) {
        const dialog=document.getElementById(id);
        if(!dialog)return;
        opener=trigger || document.activeElement;
        dialogs.forEach(item=>{if(item.open)item.close();});
        dialog.showModal();
        document.body.style.overflow='hidden';
    }
    dialogs.forEach(dialog=>{
        dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
        dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
        dialog.addEventListener('close',()=>{if(!dialogs.some(item=>item.open)){document.body.style.overflow='';if(opener?.isConnected)opener.focus({preventScroll:true});}});
    });
    document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.open,button)));
    document.querySelectorAll('#fashion-menu a').forEach(link=>link.addEventListener('click',()=>document.querySelector('#fashion-menu').close()));
    const productDialog=document.querySelector('#fashion-product');
    const productImage=document.querySelector('#fashion-product-image');
    const productTitle=document.querySelector('#product-title');
    const productCollection=document.querySelector('#fashion-product-collection');
    const flip=document.querySelector('#fashion-product-flip');
    const save=document.querySelector('#fashion-product-save');
    const bag=[];
    let selected=null,detail=false;
    function showProduct(product, trigger) {
        selected=product;detail=false;productImage.src=product.front;productImage.alt=`Túi ${product.name}`;productTitle.textContent=product.name;productCollection.textContent=product.collection;flip.textContent='Xem đường thêu';
        save.textContent=bag.some(item=>item.front===product.front)?'Đã có trong túi yêu thích ✓':'Thêm vào túi yêu thích →';
        open(productDialog.id,trigger);
    }
    document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>showProduct({name:button.dataset.product,collection:button.dataset.collection,front:button.dataset.front,detail:button.dataset.detail},button)));
    flip.addEventListener('click',()=>{if(!selected)return;detail=!detail;productImage.src=detail?selected.detail:selected.front;productImage.alt=`Túi ${selected.name}, ${detail?'chi tiết đường thêu':'mặt trước'}`;flip.textContent=detail?'Xem mặt trước':'Xem đường thêu';});
    function renderBag() {
        const list=document.querySelector('#fashion-bag-items');list.replaceChildren();
        document.querySelectorAll('[data-bag-count]').forEach(count=>count.textContent=String(bag.length));
        if(!bag.length){const empty=document.createElement('p');empty.textContent='Bạn chưa chọn thiết kế nào. Khám phá bộ sưu tập để tìm cảm hứng nhé.';list.append(empty);return;}
        bag.forEach((product,index)=>{
            const row=document.createElement('div');row.className='bag-item';
            const image=document.createElement('img');image.src=product.front;image.alt=`Túi ${product.name}`;
            const title=document.createElement('h3');title.textContent=product.name;
            const remove=document.createElement('button');remove.textContent='Bỏ chọn';remove.setAttribute('aria-label',`Bỏ chọn ${product.name}`);remove.addEventListener('click',()=>{bag.splice(index,1);renderBag();document.querySelector('#fashion-bag .dialog-close').focus();toast(`Đã bỏ ${product.name} khỏi túi yêu thích.`);});
            row.append(image,title,remove);list.append(row);
        });
    }
    save.addEventListener('click',()=>{if(!selected)return;if(!bag.some(item=>item.front===selected.front))bag.push({...selected});renderBag();save.textContent='Đã có trong túi yêu thích ✓';toast(`Đã lưu mẫu ${selected.name} vào túi yêu thích.`);});
    document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
        const image=document.querySelector('#fashion-lightbox-image');image.src=button.dataset.gallery;image.alt=button.dataset.caption;document.querySelector('#lightbox-caption').textContent=button.dataset.caption;open('fashion-lightbox',button);
    }));
    const date=document.querySelector('#fashion-date');
    const local=new Date();const today=`${local.getFullYear()}-${String(local.getMonth()+1).padStart(2,'0')}-${String(local.getDate()).padStart(2,'0')}`;date.min=today;
    document.querySelector('#fashion-booking-form').addEventListener('submit',event=>{
        event.preventDefault();const form=event.currentTarget;
        if(date.value<today){date.setCustomValidity('Vui lòng chọn ngày từ hôm nay.');date.reportValidity();return;}date.setCustomValidity('');
        const name=document.querySelector('#fashion-guest').value.trim();form.querySelector('.form-result').textContent=`Cảm ơn ${name}! Bạn vừa hoàn tất trải nghiệm đặt lịch mẫu. Thông tin không được gửi hoặc lưu trên máy chủ.`;form.reset();
    });
    date.addEventListener('input',()=>date.setCustomValidity(''));
    document.querySelector('#fashion-newsletter-form').addEventListener('submit',event=>{event.preventDefault();event.currentTarget.querySelector('.form-result').textContent='Cảm ơn bạn đã ghé atelier! Đây là đăng ký mẫu; email không được gửi hoặc lưu.';event.currentTarget.reset();});
    const video=document.querySelector('#fashion-spin-video');
    const spinName=document.querySelector('#fashion-spin-name');
    const swatches=[...document.querySelectorAll('[data-spin-src]')];
    let variant=swatches[0],drag=null;
    let paused=document.documentElement.classList.contains('motion-paused');
    const stopForInteraction=()=>{video.pause();};
    const seek=delta=>{stopForInteraction();if(Number.isFinite(video.duration)&&video.duration>0)video.currentTime=math.seek(video.currentTime,delta,video.duration);};
    swatches.forEach(button=>button.addEventListener('click',()=>{
        variant=button;video.pause();video.poster=button.dataset.spinPoster;video.src=button.dataset.spinSrc;delete video.dataset.src;video.load();video.setAttribute('aria-label',`Túi thêu ${button.dataset.spinName} xoay 360 độ`);spinName.textContent=button.dataset.spinName;swatches.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));if(!paused&&!document.hidden)video.play().catch(()=>{});
    }));
    video.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX,time:video.currentTime};stopForInteraction();video.setPointerCapture(event.pointerId);});
    video.addEventListener('pointermove',event=>{if(!drag||!Number.isFinite(video.duration)||video.duration<=0)return;video.currentTime=math.seek(drag.time,(event.clientX-drag.x)/Math.max(video.clientWidth,1)*video.duration,video.duration);});
    video.addEventListener('pointerup',()=>drag=null);video.addEventListener('pointercancel',()=>drag=null);
    document.querySelector('#fashion-spin-prev').addEventListener('click',()=>seek(-video.duration/12));document.querySelector('#fashion-spin-next').addEventListener('click',()=>seek(video.duration/12));
    document.querySelector('[data-spinner-product]').addEventListener('click',event=>showProduct({name:variant.dataset.spinName,collection:variant.dataset.spinFront.includes('olive-yellow')||variant.dataset.spinFront.includes('light-jade-green')?'Bộ sưu tập Giao sắc':'Bộ sưu tập Hoa nở',front:variant.dataset.spinFront,detail:variant.dataset.spinDetail},event.currentTarget));
    window.addEventListener('fashion:motion',event=>paused=event.detail.paused);
    video.addEventListener('error',()=>{video.poster=variant.dataset.spinPoster;toast('Video chưa tải được. Bạn vẫn có thể xem ảnh chi tiết của mẫu túi.');});
})();

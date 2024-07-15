var gdjs;(function(h){class d{constructor(e,s,t,r){this._wasRendered=!1;this._textureWidth=0;this._textureHeight=0;this._object=e;const o=s.getGame().getImageManager().getPIXITexture(t),i=r?PIXI.TilingSprite:PIXI.Sprite;this._spritesContainer=new PIXI.Container,this._wrapperContainer=new PIXI.Container,this._centerSprite=new i(new PIXI.Texture(o.baseTexture)),this._borderSprites=[new i(new PIXI.Texture(o.baseTexture)),new PIXI.Sprite(o),new i(new PIXI.Texture(o.baseTexture)),new PIXI.Sprite(o),new i(new PIXI.Texture(o.baseTexture)),new PIXI.Sprite(o),new i(new PIXI.Texture(o.baseTexture)),new PIXI.Sprite(o)],this.setTexture(t,s),this._spritesContainer.removeChildren(),this._spritesContainer.addChild(this._centerSprite);for(let n=0;n<this._borderSprites.length;++n)this._spritesContainer.addChild(this._borderSprites[n]);this._wrapperContainer.addChild(this._spritesContainer),s.getLayer("").getRenderer().addRendererObject(this._wrapperContainer,e.getZOrder())}getRendererObject(){return this._wrapperContainer}ensureUpToDate(){this._spritesContainer.visible&&this._wasRendered&&this._centerSprite.texture.baseTexture.scaleMode!==PIXI.SCALE_MODES.NEAREST&&(this._spritesContainer.cacheAsBitmap=!0),this._wasRendered=!0}updateOpacity(){this._wrapperContainer.alpha=this._object.opacity/255,this._spritesContainer.cacheAsBitmap=!1}updateAngle(){this._wrapperContainer.rotation=h.toRad(this._object.angle)}updatePosition(){this._wrapperContainer.position.x=this._object.x+this._object._width/2,this._wrapperContainer.position.y=this._object.y+this._object._height/2}_updateLocalPositions(){const e=this._object;this._centerSprite.position.x=e._lBorder,this._centerSprite.position.y=e._tBorder,this._borderSprites[0].position.x=e._width-e._rBorder,this._borderSprites[0].position.y=e._tBorder,this._borderSprites[1].position.x=e._width-this._borderSprites[1].width,this._borderSprites[1].position.y=0,this._borderSprites[2].position.x=e._lBorder,this._borderSprites[2].position.y=0,this._borderSprites[3].position.x=0,this._borderSprites[3].position.y=0,this._borderSprites[4].position.x=0,this._borderSprites[4].position.y=e._tBorder,this._borderSprites[5].position.x=0,this._borderSprites[5].position.y=e._height-this._borderSprites[5].height,this._borderSprites[6].position.x=e._lBorder,this._borderSprites[6].position.y=e._height-e._bBorder,this._borderSprites[7].position.x=e._width-this._borderSprites[7].width,this._borderSprites[7].position.y=e._height-this._borderSprites[7].height}_updateSpritesAndTexturesSize(){const e=this._object;this._centerSprite.width=Math.max(e._width-e._rBorder-e._lBorder,0),this._centerSprite.height=Math.max(e._height-e._tBorder-e._bBorder,0),this._borderSprites[0].width=e._rBorder,this._borderSprites[0].height=Math.max(e._height-e._tBorder-e._bBorder,0),this._borderSprites[2].height=e._tBorder,this._borderSprites[2].width=Math.max(e._width-e._rBorder-e._lBorder,0),this._borderSprites[4].width=e._lBorder,this._borderSprites[4].height=Math.max(e._height-e._tBorder-e._bBorder,0),this._borderSprites[6].height=e._bBorder,this._borderSprites[6].width=Math.max(e._width-e._rBorder-e._lBorder,0),this._wasRendered=!0,this._spritesContainer.cacheAsBitmap=!1}setTexture(e,s){const t=this._object,r=s.getGame().getImageManager().getPIXITexture(e).baseTexture;this._textureWidth=r.width,this._textureHeight=r.height;function o(i){return i.width<0&&(i.width=0),i.height<0&&(i.height=0),i.x<0&&(i.x=0),i.y<0&&(i.y=0),i.x>r.width&&(i.x=r.width),i.y>r.height&&(i.y=r.height),i.x+i.width>r.width&&(i.width=r.width-i.x),i.y+i.height>r.height&&(i.height=r.height-i.y),i}this._centerSprite.texture=new PIXI.Texture(r,o(new PIXI.Rectangle(t._lBorder,t._tBorder,r.width-t._lBorder-t._rBorder,r.height-t._tBorder-t._bBorder))),this._borderSprites[0].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(r.width-t._rBorder,t._tBorder,t._rBorder,r.height-t._tBorder-t._bBorder))),this._borderSprites[2].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(t._lBorder,0,r.width-t._lBorder-t._rBorder,t._tBorder))),this._borderSprites[4].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(0,t._tBorder,t._lBorder,r.height-t._tBorder-t._bBorder))),this._borderSprites[6].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(t._lBorder,r.height-t._bBorder,r.width-t._lBorder-t._rBorder,t._bBorder))),this._borderSprites[1].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(r.width-t._rBorder,0,t._rBorder,t._tBorder))),this._borderSprites[3].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(0,0,t._lBorder,t._tBorder))),this._borderSprites[5].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(0,r.height-t._bBorder,t._lBorder,t._bBorder))),this._borderSprites[7].texture=new PIXI.Texture(r,o(new PIXI.Rectangle(r.width-t._rBorder,r.height-t._bBorder,t._rBorder,t._bBorder))),this._updateSpritesAndTexturesSize(),this._updateLocalPositions(),this.updatePosition(),this._wrapperContainer.pivot.x=this._object._width/2,this._wrapperContainer.pivot.y=this._object._height/2}updateWidth(){this._wrapperContainer.pivot.x=this._object._width/2,this._updateSpritesAndTexturesSize(),this._updateLocalPositions(),this.updatePosition()}updateHeight(){this._wrapperContainer.pivot.y=this._object._height/2,this._updateSpritesAndTexturesSize(),this._updateLocalPositions(),this.updatePosition()}setColor(e){const s=e.split(";");if(!(s.length<3)){this._centerSprite.tint=h.rgbToHexNumber(parseInt(s[0],10),parseInt(s[1],10),parseInt(s[2],10));for(let t=0;t<this._borderSprites.length;t++)this._borderSprites[t].tint=h.rgbToHexNumber(parseInt(s[0],10),parseInt(s[1],10),parseInt(s[2],10));this._spritesContainer.cacheAsBitmap=!1}}getColor(){const e=new PIXI.Color(this._centerSprite.tint).toRgbArray();return Math.floor(e[0]*255)+";"+Math.floor(e[1]*255)+";"+Math.floor(e[2]*255)}getTextureWidth(){return this._textureWidth}getTextureHeight(){return this._textureHeight}destroy(){for(const e of this._borderSprites)e.destroy({texture:!0});this._centerSprite.destroy({texture:!0}),this._wrapperContainer.destroy(!1),this._spritesContainer.destroy(!1)}}h.PanelSpriteRuntimeObjectRenderer=d})(gdjs||(gdjs={}));
//# sourceMappingURL=panelspriteruntimeobject-pixi-renderer.js.map

/*
# SelectiveSelect
*/



/*
## Select Model
*/

var SelectiveSelectModel = Backbone.Model.extend({
  defaults: function() {
    return {
      val: '',
      selected: false,
      iniVal: ''
    }
  },
  
  initialize: function() {
    _.bindAll(this, 'changeValue');
    this.on('change:val', this.changeValue);
  },
  
  changeValue: function() {
    var val = this.get('val'),
        iniVal = this.get('iniVal'),
        selected = (val != iniVal)?true:false;
    this.set('selected', selected);
  }
});



/*
## 
*/

var SelectiveSelectCollection = Backbone.Collection.extend({
  model: SelectiveSelectModel
});



/*
## 
*/

var SelectiveSelect = Backbone.View.extend({
  
  events: {
    'change .selective-select__select': 'changeSelect'
  },
  
  
  initialize: function() {
    _.bindAll(this, 'changeSelect', 'switchSubmitStatus', 'disableSelect', 'isCanSubmit');
    
    this.$enabled = this.$('.selective-select__submit--enabled');
    this.$disabled = this.$('.selective-select__submit--disabled');
    this.$select = this.$('.selective-select__select');
    
    this.select = new SelectiveSelectCollection();
    this.$select.each(_.bind(function(i, e) {
      var $me = $(e),
          val = $me.val();
      this.select.add({
        val: val,
        iniVal: val
      });
    }, this));
    
    this.disableSelect( this.$select.not(':first') );
    
    this.switchSubmitStatus();
  },
  
  
  changeSelect: function(e) {
    var $me = $(e.target),
        val = $me.val(),
        index = this.$select.index(e.target);
    
    this.select.at(index).set('val', val);
    
    this.switchSubmitStatus();
  },
  
  
  switchSubmitStatus: function(){
    if(this.isCanSubmit()){
      this.$enabled.css('display','block');
      this.$disabled.css('display','none');
    } else {
      this.$enabled.css('display','none');
      this.$disabled.css('display','block');
    }
  },
  
  
  enableSelect: function($target) {
    $target
      .removeClass('selective-select__select--disabled')
      .addClass('selective-select__select--enabled')
      .find('option')
      .removeAttr('disabled');
    $target
      .parents('.selective-select__select-wrapper')
      .removeClass('selective-select__select-wrapper--disabled')
      .addClass('selective-select__select-wrapper--enabled');
  },
  
  
  disableSelect: function($target) {
    $target
      .removeClass('selective-select__select--enabled')
      .addClass('selective-select__select--disabled')
      .find('option')
      .attr('disabled', 'disabled');
    $target
      .parents('.selective-select__select-wrapper')
      .removeClass('selective-select__select-wrapper--enabled')
      .addClass('selective-select__select-wrapper--disabled');
  },
  
  
  isCanSubmit: function() {
    var result = true;
    this.select.each(_.bind(function(model, index){
      var selected = model.get('selected');
      if(!selected) result = false;
      if(index) {
        if(this.select.at(index-1).get('selected')) {
          this.enableSelect(this.$select.eq(index));
        } else {
          this.disableSelect(this.$select.eq(index));
        }
      }
    }, this));
    return result;
  }
  
});

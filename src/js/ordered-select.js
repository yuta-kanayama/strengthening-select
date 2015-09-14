/*
# OrderedSelect
*/



/*
## Select Model
*/

var OrderedSelectModel = Backbone.Model.extend({
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

var OrderedSelectCollection = Backbone.Collection.extend({
  model: OrderedSelectModel
});



/*
## 
*/

var OrderedSelect = Backbone.View.extend({
  
  events: {
    'change .ordered-select__select': 'changeSelect'
  },
  
  
  initialize: function() {
    _.bindAll(this, 'changeSelect', 'switchSubmitStatus', 'disableSelect', 'isCanSubmit');
    
    this.$enabled = this.$('.ordered-select__submit--enabled');
    this.$disabled = this.$('.ordered-select__submit--disabled');
    this.$select = this.$('.ordered-select__select');
    
    this.select = new OrderedSelectCollection();
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
      .removeClass('ordered-select__select--disabled')
      .addClass('ordered-select__select--enabled')
      .find('option')
      .removeAttr('disabled');
    $target
      .parents('.ordered-select__select-wrapper')
      .removeClass('ordered-select__select-wrapper--disabled')
      .addClass('ordered-select__select-wrapper--enabled');
  },
  
  
  disableSelect: function($target) {
    $target
      .removeClass('ordered-select__select--enabled')
      .addClass('ordered-select__select--disabled')
      .find('option')
      .attr('disabled', 'disabled');
    $target
      .parents('.ordered-select__select-wrapper')
      .removeClass('ordered-select__select-wrapper--enabled')
      .addClass('ordered-select__select-wrapper--disabled');
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

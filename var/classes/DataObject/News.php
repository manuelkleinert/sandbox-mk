<?php 

/** 
* Generated at: 2017-09-22T15:03:51+02:00
* Inheritance: no
* Variants: no
* Changed by: wvision (1)
* IP: 172.18.0.1


Fields Summary: 
- localizedfields [localizedfields]
-- title [input]
-- teaser [textarea]
-- text [wysiwyg]
- date [datetime]
- image_1 [image]
- image_2 [image]
- image_3 [image]
*/ 

namespace Pimcore\Model\DataObject;



/**
* @method \Pimcore\Model\DataObject\News\Listing getByLocalizedfields ($field, $value, $locale = null, $limit = 0) 
* @method static \Pimcore\Model\DataObject\News\Listing getByDate ($value, $limit = 0) 
* @method static \Pimcore\Model\DataObject\News\Listing getByImage_1 ($value, $limit = 0) 
* @method static \Pimcore\Model\DataObject\News\Listing getByImage_2 ($value, $limit = 0) 
* @method static \Pimcore\Model\DataObject\News\Listing getByImage_3 ($value, $limit = 0) 
*/

class News extends Concrete {

public $o_classId = 1;
public $o_className = "News";
public $localizedfields;
public $date;
public $image_1;
public $image_2;
public $image_3;


/**
* @param array $values
* @return \Pimcore\Model\DataObject\News
*/
public static function create($values = array()) {
	$object = new static();
	$object->setValues($values);
	return $object;
}

/**
* Get localizedfields - 
* @return \Pimcore\Model\DataObject\Localizedfield
*/
public function getLocalizedfields () {
	$preValue = $this->preGetValue("localizedfields"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	$data = $this->getClass()->getFieldDefinition("localizedfields")->preGetData($this);
	return $data;
}

/**
* Get title - Titel
* @return string
*/
public function getTitle ($language = null) {
	$data = $this->getLocalizedfields()->getLocalizedValue("title", $language);
	$preValue = $this->preGetValue("title"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	 return $data;
}

/**
* Get teaser - Teaser
* @return string
*/
public function getTeaser ($language = null) {
	$data = $this->getLocalizedfields()->getLocalizedValue("teaser", $language);
	$preValue = $this->preGetValue("teaser"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	 return $data;
}

/**
* Get text - Text
* @return string
*/
public function getText ($language = null) {
	$data = $this->getLocalizedfields()->getLocalizedValue("text", $language);
	$preValue = $this->preGetValue("text"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	 return $data;
}

/**
* Set localizedfields - 
* @param \Pimcore\Model\DataObject\Localizedfield $localizedfields
* @return \Pimcore\Model\DataObject\News
*/
public function setLocalizedfields ($localizedfields) {
	$this->localizedfields = $localizedfields;
	return $this;
}

/**
* Set title - Titel
* @param string $title
* @return \Pimcore\Model\DataObject\News
*/
public function setTitle ($title, $language = null) {
	$this->getLocalizedfields()->setLocalizedValue("title", $title, $language);
	return $this;
}

/**
* Set teaser - Teaser
* @param string $teaser
* @return \Pimcore\Model\DataObject\News
*/
public function setTeaser ($teaser, $language = null) {
	$this->getLocalizedfields()->setLocalizedValue("teaser", $teaser, $language);
	return $this;
}

/**
* Set text - Text
* @param string $text
* @return \Pimcore\Model\DataObject\News
*/
public function setText ($text, $language = null) {
	$this->getLocalizedfields()->setLocalizedValue("text", $text, $language);
	return $this;
}

/**
* Get date - Datum
* @return \Carbon\Carbon
*/
public function getDate () {
	$preValue = $this->preGetValue("date"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	$data = $this->date;
	return $data;
}

/**
* Set date - Datum
* @param \Carbon\Carbon $date
* @return \Pimcore\Model\DataObject\News
*/
public function setDate ($date) {
	$this->date = $date;
	return $this;
}

/**
* Get image_1 - Bild 1
* @return \Pimcore\Model\Asset\Image
*/
public function getImage_1 () {
	$preValue = $this->preGetValue("image_1"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	$data = $this->image_1;
	return $data;
}

/**
* Set image_1 - Bild 1
* @param \Pimcore\Model\Asset\Image $image_1
* @return \Pimcore\Model\DataObject\News
*/
public function setImage_1 ($image_1) {
	$this->image_1 = $image_1;
	return $this;
}

/**
* Get image_2 - Bild 2
* @return \Pimcore\Model\Asset\Image
*/
public function getImage_2 () {
	$preValue = $this->preGetValue("image_2"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	$data = $this->image_2;
	return $data;
}

/**
* Set image_2 - Bild 2
* @param \Pimcore\Model\Asset\Image $image_2
* @return \Pimcore\Model\DataObject\News
*/
public function setImage_2 ($image_2) {
	$this->image_2 = $image_2;
	return $this;
}

/**
* Get image_3 - Bild 3
* @return \Pimcore\Model\Asset\Image
*/
public function getImage_3 () {
	$preValue = $this->preGetValue("image_3"); 
	if($preValue !== null && !\Pimcore::inAdmin()) { 
		return $preValue;
	}
	$data = $this->image_3;
	return $data;
}

/**
* Set image_3 - Bild 3
* @param \Pimcore\Model\Asset\Image $image_3
* @return \Pimcore\Model\DataObject\News
*/
public function setImage_3 ($image_3) {
	$this->image_3 = $image_3;
	return $this;
}

protected static $_relationFields = array (
);

public $lazyLoadedFields = array (
);

}


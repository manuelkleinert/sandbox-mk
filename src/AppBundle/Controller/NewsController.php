<?php
/**
 * w-vision
 *
 * LICENSE
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that is distributed with this source code.
 *
 * @copyright  Copyright (c) 2017 Woche-Pass AG (https://www.w-vision.ch)
 */

namespace AppBundle\Controller;

use Carbon\Carbon;
use Pimcore\Controller\FrontendController;
use Pimcore\Model\DataObject;
use Symfony\Component\HttpFoundation\Request;

class NewsController extends FrontendController
{
    /**
     * @return string The template to be rendered
     */
    public function listAction()
    {
        $list = new DataObject\News\Listing();
        $list->setOrderKey('o_creationDate');
        $list->setOrder('desc');
        $list->setCondition('date >= :now', ['now' => Carbon::now()->getTimestamp()]);

        return $this->renderTemplate('News/list.html.twig', [
            'list' => $list
        ]);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function detailAction(Request $request)
    {
        $object = null;
        $id = $request->get('id');

        if (!is_null($id)) {
            $object = DataObject\News::getById($id);
        }

        return $this->renderTemplate('News/detail.html.twig', [
            'object' => $object
        ]);
    }

    public function teaserSectionAction()
    {
        $list = new DataObject\News\Listing();
        $list->setLimit(3);
        $list->setOrderKey('o_creationDate');
        $list->setOrder('desc');
        $list->setCondition('date >= :now', ['now' => Carbon::now()->getTimestamp()]);

        return $this->renderTemplate('News/Templates/teaser-section.html.twig', [
            'list' => $list
        ]);
    }
}

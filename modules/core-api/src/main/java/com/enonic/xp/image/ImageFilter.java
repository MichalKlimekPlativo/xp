package com.enonic.xp.image;

import java.awt.image.BufferedImage;

import com.google.common.annotations.Beta;

@Beta
public interface ImageFilter
{
    BufferedImage filter( BufferedImage source );
}

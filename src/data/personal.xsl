<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
    <xsl:param name="year" select="toto"/>
    <xsl:param name="sem" select="toto"/>

    <xsl:template match="/">
        <html>
        <body>
            <element_module>
                <xsl:apply-templates select=".//module[$sem=name(..) and $year=name(../..)]"/>
            </element_module>

            <element_project>
                <xsl:apply-templates select=".//time"/>
            </element_project>
        </body>
        </html>
    </xsl:template>

    <xsl:template match="module">
        <div style="font-weight: bold;"><xsl:value-of select="./@name"/></div>
        <ul>
            <xsl:apply-templates select="./subject"/>
        </ul>
    </xsl:template>

    <xsl:template match="subject">
        <li>
            <a>
            <xsl:attribute name="href"><xsl:value-of select="./@src"/></xsl:attribute>
            <xsl:value-of select="."/></a>
        </li>
    </xsl:template>

    <xsl:template match="time">
        <div style="font-weight: bold;"><xsl:value-of select="./@time"/></div>
        <ul>
            <xsl:apply-templates select="./project"/>
        </ul>
    </xsl:template>

    <xsl:template match="project">
        <li>
            <xsl:value-of select="."/>: <a><xsl:attribute name="href"><xsl:value-of select="./@src"/></xsl:attribute>here</a>
        </li>
    </xsl:template>


</xsl:stylesheet>
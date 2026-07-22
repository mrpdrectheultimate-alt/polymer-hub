-- Sprint 0A-R3: Publication Integrity Trigger & Database Validation

CREATE OR REPLACE FUNCTION public.validate_video_publication()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'published' THEN
    IF NEW.embed_status NOT IN ('working', 'blocked') THEN
      RAISE EXCEPTION 'Published video must have working or blocked embed status';
    END IF;

    IF NEW.academic_review_status NOT IN ('approved', 'approved_with_caveat') THEN
      RAISE EXCEPTION 'Published video requires academic approval (approved or approved_with_caveat)';
    END IF;

    IF NEW.oembed_verified_at IS NULL THEN
      RAISE EXCEPTION 'Published video requires oEmbed verification timestamp';
    END IF;

    IF NEW.thumbnail_verified_at IS NULL THEN
      RAISE EXCEPTION 'Published video requires thumbnail verification timestamp';
    END IF;

    IF COALESCE(NEW.manual_playback_verified, false) = false AND NEW.embed_status = 'working' THEN
      RAISE EXCEPTION 'Working embeds require manual playback verification';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_video_publication ON public.videos;

CREATE TRIGGER trg_validate_video_publication
BEFORE INSERT OR UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.validate_video_publication();

import { useLocation } from "react-router-dom";

export class NavigationRepository {
  constructor() {}

  useQueryParams(): URLSearchParams {
    const location = useLocation();

    return new URLSearchParams(location.search);
  }
}
